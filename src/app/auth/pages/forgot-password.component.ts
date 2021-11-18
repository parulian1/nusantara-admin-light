import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '@nusantara/auth/auth.service'; // <- need to import directly to avoid circular imports
import { ErrorResult } from '@nusantara/core';
import { IError } from '@nusantara/models';

@Component({
  selector: 'nus-forgot-password',
  template: `
    <h1 i18n>Forgot Password</h1>
    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>
    <form [formGroup]="form" (ngSubmit)="submitPasswordReset()">

      <label>
        <span i18n>Site Domain</span>
        <input type="text" formControlName="siteDomain" placeholder="Ex, www.mysite.com">
        <div *ngIf="siteDomain.invalid && (siteDomain.touched || siteDomain.dirty)" class="error-detail">
          <div *ngIf="siteDomain.errors?.required" i18n>Site Domain is required</div>
          <div *ngIf="siteDomain.errors?.apiError">{{ siteDomain.getError('apiError') }}</div>
        </div>
      </label>

      <label>
        <span i18n>Email Address</span>
        <input type="email" formControlName="email" placeholder="email@domain.com">
        <div *ngIf="email.invalid && (email.touched || email.dirty)" class="error-detail">
          <div *ngIf="email.errors?.required" i18n>Email is required</div>
          <div *ngIf="email.errors?.apiError">{{ email.getError('apiError') }}</div>
        </div>
      </label>

      <div class="controls-container">
        <button type="submit" [disabled]="!form.valid" class="control" i18n>Reset Your Password</button>
      </div>

    </form>

    <nav>
      <a [routerLink]="['/auth/login']" i18n>Back to Login</a>
    </nav>
  `,
  styles: [`
    :host {
      padding-left: 33px;
      padding-right: 33px;
      display: block;
    }

    h1 {
      display: none;
    }

    nav {
      padding-top: 50px;
      padding-bottom: 5px;
      text-align: center;
    }

    a {
      text-decoration: none;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  nonFieldErrors: Array<string> = [];
  readonly afterForgotPasswordUrl = '/auth/forgot-password-sent';

  constructor(private fb: FormBuilder,
              private service: AuthService,
              private router: Router) { }

  get email(): FormControl { return this.form.get('email') as FormControl; }
  get siteDomain(): FormControl { return this.form.get('siteDomain') as FormControl; }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      siteDomain: ['', [Validators.required]],
    });
  }

  submitPasswordReset() {
    this.nonFieldErrors.length = 0;
    this.form.disable();

    this.service
      .forgotPassword(this.email.value, this.siteDomain.value)
      .pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IError>(err.error, err.status));
        } else {
          return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
        }
      }))
      .subscribe(result => {
          if (result instanceof ErrorResult) {
            this.onSubmitFail(result.errorDetails);
          } else {
            this.onSubmitSuccess();
          }
        },
        (error) => this.onSubmitFail(error));
  }

  onSubmitSuccess() {
    this.form.enable();
    this.router.navigateByUrl(decodeURIComponent(this.afterForgotPasswordUrl));
  }

  onSubmitFail(errorDetails: any) {
    this.form.enable();

    // this.nonFieldErrors.push(errorDetails.message);

    // form specific errors -- take the first error message and display.
    // errorDetails.details.forEach((error) => {
    //   this.form.controls[error.field].setErrors({
    //     apiError: error.message,
    //   });
    // });
  }
}
