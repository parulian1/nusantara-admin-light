import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { ISiteConfig, LicenseTypeChoices } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigService extends AbstractCrudService<ISiteConfig> {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * The user's primary license type, from the browser's localStorage.
   */
  get licenseType(): string {
    return localStorage.getItem(SiteConfigService.LICENSE_TYPE);
  }

  set licenseType(value: string) {
    if (value === null) {
      localStorage.removeItem(SiteConfigService.LICENSE_TYPE);
    } else {
      localStorage.setItem(SiteConfigService.LICENSE_TYPE, value);
    }
  }
  static readonly LICENSE_TYPE = 'license';

  baseUrl = '/api/client/site-config';

  /**
   * Writes the license type to localStorage.
   * @param licenseType data (returned from the site config api)
   * @public
   */
  saveLicenseType(licenseType: string): void {
    this.licenseType = licenseType;
  }

  isEnterpriseLicense() {
    return this.licenseType === LicenseTypeChoices.ENTERPRISE;
  }

}
