import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IWidget } from '@nusantara/models';
// import { BannerService } from '@nusantara/services';
import { IBannerGroup } from '../../../models/widgets/banner-group';

@Injectable({
  providedIn: 'root',
})
export class BannerGroupResolver extends AbstractDetailResolver<IBannerGroup> {
  // constructor(service: BannerService) { super(service); }
}
