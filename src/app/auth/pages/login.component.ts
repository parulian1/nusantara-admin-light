import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ILoginFailure } from '@nusantara/auth/models';
import { ErrorResult } from '@nusantara/core/responses';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

/**
 * Allows the user to authenticate with an email address and password.
 * If authentication is successful, the user will automatically be
 * redirected to '/' or to the URL specified by the 'next' query parameter.
 */
@Component({
  selector: 'nus-login',
  template: `
    <h1>Login</h1>

    <ul *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="tryLogin()">
      <label>
        <span>Email Address</span>
        <input type="email" formControlName="email">

        <div *ngIf="email.invalid && (email.dirty || email.touched)">
          <div *ngIf="email.errors.required">Email is required</div>
          <div *ngIf="email.errors.apiError">{{ email.getError('apiError') }}</div>
        </div>
      </label>
      <label>
        <span>Password</span>
        <input type="password" formControlName="password">

        <div *ngIf="password.invalid && (password.dirty || password.touched)">
          <div *ngIf="password.errors.required">Password is required</div>
          <div *ngIf="password.errors.apiError">{{ password.getError('apiError') }}</div>
        </div>
      </label>
      <div>
          <button type="submit" [disabled]="!form.valid">Login</button>
      </div>
    </form>
    <div>
      <a [routerLink]="['/auth/forgot-password']">Forgot Password</a>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public nonFieldErrors: Array<string> = [];
  next: string;

  constructor(private fb: FormBuilder,
              private service: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  get email(): FormControl { return this.form?.get('email') as FormControl; }
  get password(): FormControl { return this.form?.get('password') as FormControl; }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      this.next = paramMap.get('next') ?? '/';
    });
  }

  tryLogin() {

    this.nonFieldErrors.length = 0;

    this.service.login(this.email.value, this.password.value)
      .pipe(catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<ILoginFailure>(err.error, err.status));
        } else {
          return of(new ErrorResult<ILoginFailure>({detail: 'Network error.. probably?'}, err.status));
        }
      }))
      .subscribe(result => {
       if (result instanceof ErrorResult) {
         this.onLoginFail(result.errorDetails);
       } else {
         this.onLoginSuccess();
       }
    });
  }

  private onLoginSuccess() {
    this.router.navigateByUrl(decodeURIComponent(this.next));
  }
  private onLoginFail(errorDetails: ILoginFailure) {

    if (!!errorDetails.detail) {
      this.nonFieldErrors.push(errorDetails.detail);
    }

    errorDetails.nonFieldErrors?.forEach(
      errMsg => this.nonFieldErrors.push(errMsg)
    );

    // form specific errors -- take the first error message and display.
    if (!!errorDetails?.email.length) {
      this.email.setErrors({apiError: errorDetails.email[0]});
    }
    if (!!errorDetails?.password.length) {
      this.password.setErrors({apiError: errorDetails.password[0]});
    }
  }
}
