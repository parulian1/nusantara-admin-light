import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ILoginFailure } from '@nusantara/auth/models';
import { AuthService } from '@nusantara/auth/auth.service';
import { ErrorResult } from '@nusantara/core/responses';
import { ToastService } from '@nusantara/core/toast';

/**
 * Allows the user to authenticate with an email address and password.
 * If authentication is successful, the user will automatically be
 * redirected to '/' or to the URL specified by the 'next' query parameter.
 */
@Component({
  selector: 'nus-login',
  template: `
    <h1>Login</h1> <!-- Hidden: Kept for Screen Readers Only -->

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="login()">

      <label>
        <span>Site Domain</span>
        <input type="text" formControlName="siteDomain" placeholder="Ex, www.mysite.com" [disabled]="isBusy">
        <div *ngIf="siteDomain.invalid && (siteDomain.dirty || siteDomain.touched)" class="error-detail">
          <div *ngIf="siteDomain.errors.required">Site Domain is required</div>
          <div *ngIf="siteDomain.errors.apiError">{{ siteDomain.getError('apiError') }}</div>
        </div>
      </label>

      <label>
        <span>Email Address</span>
        <input type="email" [formControl]="email" placeholder="email@domain.com" [disabled]="isBusy">
        <nus-field-errors [control]="email"></nus-field-errors>
      </label>

      <label>
        <span>Password</span>
        <input type="password" [formControl]="password" [disabled]="isBusy">
        <nus-field-errors [control]="password"></nus-field-errors>
      </label>

      <div class="controls-container">
        <button type="submit" [disabled]="!form.valid || isBusy" class="control">
          <span>Login</span>
        </button>
      </div>

    </form>

    <nav>
      <a [routerLink]="['/auth/forgot-password']">Forgot Your Password?</a>
    </nav>
  `,
  styles: [`
    :host {
      padding-left: 33px;
      padding-right: 33px;
      display: block;
    }
    h1 { display: none; }

    nav {
      padding-top: 50px;
      padding-bottom: 5px;
      text-align: center;
    }
    a { text-decoration: none; }
  `]
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  nonFieldErrors: Array<string> = [];
  afterLoginUrl: string;
  isBusy = false;

  constructor(private fb: FormBuilder,
              private service: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService) { }

  get email(): FormControl { return this.form?.get('email') as FormControl; }
  get password(): FormControl { return this.form?.get('password') as FormControl; }
  get siteDomain(): FormControl { return this.form?.get('siteDomain') as FormControl; }

  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      siteDomain: ['', [Validators.required]],
    });

    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      this.afterLoginUrl = paramMap.get('next') ?? '/';
    });
  }

  /**
   * Attempts to log the user in.
   * If successful, their auth token will be saved and they will be redirected.
   */
  login() {

    this.nonFieldErrors.length = 0;
    this.isBusy = true;
    this.service
      .login(this.email.value, this.password.value, this.siteDomain.value)
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
    this.isBusy = false;
    this.toastService.addSuccess(`Welcome ${this.email.value}!`, 'Login Success');
    this.router.navigateByUrl(decodeURIComponent(this.afterLoginUrl));
  }

  private onLoginFail(errorDetails: ILoginFailure) {
    this.isBusy = false;
    this.toastService.addError('Sorry!  Please check your email/password and try again');
    if (!!errorDetails.detail) {
      this.nonFieldErrors.push(errorDetails.detail);
    }

    errorDetails.nonFieldErrors?.forEach(
      (errMsg) => { this.nonFieldErrors.push(errMsg); }
    );

    // form specific errors -- take the first error message and display.
    if (!!errorDetails?.email?.length) {
      this.email.setErrors({apiError: errorDetails.email[0]});
    }
    if (!!errorDetails?.password?.length) {
      this.password.setErrors({apiError: errorDetails.password[0]});
    }
  }
}
