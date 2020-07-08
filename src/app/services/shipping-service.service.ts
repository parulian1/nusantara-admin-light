import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IShippingService } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ShippingServiceService extends AbstractCrudService<IShippingService> {

  baseUrl = '/api/fulfillment/service';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
