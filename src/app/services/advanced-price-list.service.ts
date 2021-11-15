import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';

@Injectable({
  providedIn: 'root'
})

export  class AdvancedPriceListService extends AbstractCrudService<IAdvancedPriceList> {
  baseUrl = '/api/catalog/advance-price';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

}
