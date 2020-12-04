import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';
import { ErrorResult } from '@nusantara/core/responses';
import { IError } from '@nusantara/models/base/error';

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
        <input type="text" formControlName="siteDomain" placeholder="Ex, www.mysite.com">
        <nus-field-errors [control]="siteDomain"></nus-field-errors>
      </label>

      <label>
        <span>Email Address</span>
        <input type="email" [formControl]="email" placeholder="email@domain.com">
        <nus-field-errors [control]="email"></nus-field-errors>
      </label>

      <label>
        <span>Password</span>
        <input type="password" [formControl]="password">
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
              private activatedRoute: ActivatedRoute) { }

  get email(): FormControl { return this.form?.get('email') as FormControl; }
  get password(): FormControl { return this.form?.get('password') as FormControl; }
  get siteDomain(): FormControl { return this.form?.get('siteDomain') as FormControl; }

  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      .subscribe(result => {
       if (result instanceof ErrorResult) {
         this.onLoginFail(result.errorDetails);
       } else {
         this.onLoginSuccess();
       }
    });

    this.form.disable();
  }

  private onLoginSuccess() {
    this.form.enable();
    this.router.navigateByUrl(decodeURIComponent(this.afterLoginUrl));
  }

  private onLoginFail(errorDetails: IError) {
    this.isBusy = false;
    this.form.enable();

    errorDetails.details.forEach((error) => {
      this.form.controls[error.field].setErrors({
        apiError: error.message
      });
    });
    this.nonFieldErrors.push(errorDetails.message);
  }
}
