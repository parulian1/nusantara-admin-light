import { Injectable } from '@angular/core';

import {AdvancedPriceListService} from '@nusantara/services';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';
import {AbstractListResolver} from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class AdvancedPriceListResolver extends AbstractListResolver<IAdvancedPriceList> {
  constructor(service: AdvancedPriceListService) { super(service); }

}
