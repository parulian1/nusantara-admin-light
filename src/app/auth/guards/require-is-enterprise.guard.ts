import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LicenseTypeChoices } from '@nusantara/models';

import { SiteConfigService } from '@nusantara/services';

/**
 * Verifies that the user has the license as SME or Entreprise.
 */
@Injectable({
  providedIn: 'root'
})
export class RequireIsEnterpriseGuard implements CanActivate {

  constructor(public config: SiteConfigService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.config.licenseType === LicenseTypeChoices.ENTERPRISE;
  }
}
