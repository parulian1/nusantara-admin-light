import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';

/**
 * Verifies that the user has the is_staff claim on their JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class RequireIsStaffGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !this.auth.tokenPayload?.is_staff !== true;
  }
}
