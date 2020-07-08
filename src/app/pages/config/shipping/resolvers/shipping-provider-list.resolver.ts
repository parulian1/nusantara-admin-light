import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IShippingProvider } from '@nusantara/models';
import { ShippingProviderService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ShippingProviderListResolver extends AbstractListResolver<IShippingProvider> {
  constructor(service: ShippingProviderService) { super(service); }
}
