import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';

/**
 * Verifies that the user has the is_staff claim on their JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class RequireSiteMatchGuard implements CanActivate {
  redirectOnFail = '/auth/login';

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.tokenPayload?.site !== this.auth.siteDomain) {
      this.auth.logout();
      this.router.navigate([this.redirectOnFail, ], {queryParams: {next: state.url}});
      return false;
    }
    return true;
  }
}
