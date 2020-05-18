// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { environment } from '@env/environment';
import { AuthService } from '../auth.service';


/**
 * Requires that the user is currently **not** logged in.  If the user is logged in, redirect to the dashboard
 * landing page.
 */
@Injectable({
  providedIn: 'root'
})
export class RequireAnonymousGuard implements CanActivate {

  redirectOnFail = '/';

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated) {
      this.router.navigate([this.redirectOnFail]);
      return false;
    }
    return true;
  }
}
