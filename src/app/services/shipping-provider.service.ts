import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IShippingProvider } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ShippingProviderService extends AbstractCrudService<IShippingProvider> {

  baseUrl = '/api/fulfillment/provider';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
