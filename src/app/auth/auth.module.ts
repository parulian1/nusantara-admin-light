import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import {
  LoginComponent,
  ForgotPasswordComponent,
  ForgotPasswordSentComponent,
  ResetPasswordComponent,
} from './pages';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ForgotPasswordSentComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
