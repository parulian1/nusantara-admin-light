import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PriceListRangeService extends AbstractCrudService<products.IPriceListRange> {

  baseUrl = '/api/catalog/price-list-range';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
