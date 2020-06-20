import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IShippingRate } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ShippingRateService extends AbstractCrudService<IShippingRate> {

  baseUrl = '/api/fulfillment/rate';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
