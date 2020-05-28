import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { AuthService } from '../auth.service';

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
    h1 { display: none; }
    nav {
      padding-top: 50px;
      padding-bottom: 5px;
      text-align: center;
    }
    a { text-decoration: none; }
  `]
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  nonFieldErrors: Array<string> = [];

  constructor(private fb: FormBuilder,
              private service: AuthService,
              private router: Router,
              private toastService: ToastService) { }

  get email(): FormControl { return this.form?.get('email') as FormControl; }
  get siteDomain(): FormControl { return this.form?.get('siteDomain') as FormControl; }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      siteDomain: ['', [Validators.required]],
    });
  }

  submitPasswordReset() {

  }

  onSubmitSuccess() {

  }

  onSubmitFail(errorDetails: any) {

  }


}
