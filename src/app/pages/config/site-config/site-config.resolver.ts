import { Injectable } from '@angular/core';

import { SiteConfigService } from '@nusantara/services';
import { ISiteConfig } from '@nusantara/models';
import { AbstractDetailResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class SiteConfigResolver extends AbstractDetailResolver<ISiteConfig> {
  constructor(service: SiteConfigService) { super(service); }

}
