import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { BannerService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class BannerTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: BannerService) {
    super('type');
  }
}
