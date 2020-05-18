// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { environment } from '@env/environment';
import { AuthService } from '../auth.service';

/**
 * Requires that the user be authenticated with a valid token.
 * If the token is valid, and there is a refresh token present, then an attempt will be made to refresh
 * the token and continue on.
 */
@Injectable({
  providedIn: 'root'
})
export class RequireLoggedInGuard implements CanActivate {

  redirectOnFail = '/auth/login';

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated) {
      // possible user's token is expired -- if this is the case
      // make sure that their tokens are completely deleted before
      // redirecting them ot the login page.
      this.auth.logout();


      this.router.navigate([this.redirectOnFail, ]);
      return false;
    }


    return true;
  }
}
