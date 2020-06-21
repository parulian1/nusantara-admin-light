import { Injectable } from '@angular/core';

import { IShippingProvider } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';
import { AbstractListResolver } from '@nusantara/core/resolvers';

@Injectable({
  providedIn: 'root'
})
export class ShippingProviderListResolver extends AbstractListResolver<IShippingProvider> {
  constructor(protected service: ShippingProviderService) { super(); }
}
