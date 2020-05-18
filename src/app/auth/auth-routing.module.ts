import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  LoginComponent,
  LogoutComponent,
  ForgotPasswordComponent,
  ForgotPasswordSentComponent,
  ResetPasswordComponent,
} from './pages';
import { RequireAnonymousGuard, RequireLoggedInGuard } from '@nusantara/auth/guards';

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RequireAnonymousGuard, ],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [RequireLoggedInGuard, ],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [RequireAnonymousGuard, ],
  },
  {
    path: 'forgot-password-sent',
    component: ForgotPasswordSentComponent,
    canActivate: [RequireAnonymousGuard, ],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [RequireAnonymousGuard, ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
