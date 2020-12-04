import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { banner } from '@nusantara/models';
import { BannerService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class BannerResolver extends AbstractDetailResolver<banner.IBanner> {
  constructor(service: BannerService) { super(service); }
}
