import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ShippingProviderService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ShippingProviderTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: ShippingProviderService) {
    super('type');
  }
}
