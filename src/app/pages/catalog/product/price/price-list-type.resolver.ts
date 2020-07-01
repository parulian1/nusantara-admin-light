import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { PriceListService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class PriceListTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: PriceListService) {
    super('type');
  }
}
