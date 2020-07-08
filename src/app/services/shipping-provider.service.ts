import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IShippingProvider } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ShippingProviderService extends AbstractCrudService<IShippingProvider> {

  baseUrl = '/api/fulfillment/provider';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
