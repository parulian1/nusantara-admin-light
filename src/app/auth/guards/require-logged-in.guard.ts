// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated) {
      this.auth.logout();
      this.router.navigate([this.redirectOnFail, ], {queryParams: {next: state.url}});
      return false;
    }
    return true;
  }
}
