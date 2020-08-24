import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '@nusantara/auth';
import { IForgotPasswordFailure } from '@nusantara/auth/models';
import { ErrorResult, ToastService } from '@nusantara/core';

@Component({
  selector: 'nus-forgot-password',
  template: `
    <h1>Forgot Password</h1>
    <form [formGroup]="form" (ngSubmit)="submitPasswordReset()">

      <label>
        <span>Site Domain</span>
        <input type="text" formControlName="siteDomain" placeholder="Ex, www.mysite.com">
        <div *ngIf="siteDomain.invalid && (siteDomain.dirty || siteDomain.touched)" class="error-detail">
          <div *ngIf="siteDomain.errors.required">Site Domain is required</div>
          <div *ngIf="siteDomain.errors.apiError">{{ siteDomain.getError('apiError') }}</div>
        </div>
      </label>

      <label>
        <span>Email Address</span>
        <input type="email" formControlName="email" placeholder="email@domain.com">
        <div *ngIf="email.invalid && (email.dirty || email.touched)" class="error-detail">
          <div *ngIf="email.errors.required">Email is required</div>
          <div *ngIf="email.errors.apiError">{{ email.getError('apiError') }}</div>
        </div>
      </label>

      <div class="controls-container">
        <button type="submit" [disabled]="!form.valid" class="control">Reset Your Password</button>
      </div>

    </form>

    <nav>
      <a [routerLink]="['/auth/login']">Back to Login</a>
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
  afterForgotPasswordUrl: string;

  constructor(private fb: FormBuilder,
              private service: AuthService,
              private router: Router,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute) {
  }

  get email(): FormControl { return this.form.get('email') as FormControl; }
  get siteDomain(): FormControl { return this.form.get('siteDomain') as FormControl; }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      siteDomain: ['', [Validators.required]],
    });

    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      this.afterForgotPasswordUrl = paramMap.get('next') ?? '/auth/forgot-password-sent';
    });
  }

  submitPasswordReset() {
    this.nonFieldErrors.length = 0;

    this.service
      .forgotPassword(this.email.value, this.siteDomain.value)
      .pipe(catchError(err => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IForgotPasswordFailure>(err.error, err.status));
        } else {
          return of(new ErrorResult<IForgotPasswordFailure>({detail: 'Network error.. probably?'}, err.status));
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
    this.form.disable();
  }

  onSubmitSuccess() {
    this.form.enable();
    this.router.navigateByUrl(decodeURIComponent(this.afterForgotPasswordUrl));
  }

  onSubmitFail(errorDetails: any) {
    this.form.enable();

    errorDetails.nonFieldErrors?.forEach(
      (errMsg) => {
        this.nonFieldErrors.push(errMsg);
      }
    );

    // form specific errors -- take the first error message and display.
    if (errorDetails?.email?.length) {
      this.email.setErrors({apiError: errorDetails.email[0]});
    }
  }
}
