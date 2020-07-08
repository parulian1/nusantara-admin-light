import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PriceListService extends AbstractCrudService<products.IPriceList> {

  baseUrl = '/api/catalog/price-list';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
