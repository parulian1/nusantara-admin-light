import { AbstractCrudService } from '@nusantara/core';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export  class AdvancedPriceListService extends AbstractCrudService<IAdvancedPriceList> {
  baseUrl = '/api/catalog/advanced-price-list';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

}
