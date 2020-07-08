import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IShippingProvider } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ShippingProviderResolver extends AbstractDetailResolver<IShippingProvider> {
  constructor(service: ShippingProviderService) { super(service); }
}
