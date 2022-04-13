import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild
} from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';
import { Observable } from 'rxjs';

/**
 * Verifies that the user has the is_staff claim on their JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class RequirePermissionGuard implements CanActivate, CanActivateChild {

  constructor(public auth: AuthService, public router: Router) {
  }

  groups(): Array<string> {
    return this.auth?.tokenPayload.groups ?? [];
  }

  allowToActivate(path?: string) {
    if (!!this.auth?.tokenPayload?.is_superuser) {
      return true;
    } else {
      const otherGroupFound = !!this.groups().find((group) => {
        return group.toLocaleLowerCase().indexOf('fulfillment') === -1;
      });
      if (!!otherGroupFound) {
        return true;
      } else {
        let isFulfillmentSection: boolean;
        if (!!path) {
          isFulfillmentSection = path.indexOf('fulfillment') > -1;
        } else {
          isFulfillmentSection = this.router.url.indexOf('fulfillment') > -1
        }
        if (!!isFulfillmentSection) {
          return !!this.groups().find((group) => {
            return group.toLocaleLowerCase().indexOf('fulfillment') > -1;
          });
        } else {
          return false;
        }
      }
    }
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot, path?: string): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isActive = this.allowToActivate(path);
    return isActive;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isActive = this.allowToActivate(state.url ?? '');
    if (!isActive) {
      return this.router.parseUrl('');
    }
    return isActive;
  }
}
