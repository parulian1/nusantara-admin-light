import { Injectable } from '@angular/core';

import { IShippingProvider } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';
import { AbstractDetailResolver } from '@nusantara/core/resolvers';

@Injectable({
  providedIn: 'root',
})
export class ShippingProviderResolver extends AbstractDetailResolver<IShippingProvider> {
  constructor(protected service: ShippingProviderService) { super(); }
}
