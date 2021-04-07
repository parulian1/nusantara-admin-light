import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import {IConfigCartDiscount} from '@nusantara/models/config-cart-discount';

@Injectable({
  providedIn: 'root'
})
export class ConfigCartDiscountService extends AbstractCrudService<IConfigCartDiscount> {

  baseUrl = '/api/client/site-config';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

}
