import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import {IWarehouse, products} from '@nusantara/models';
import {Observable} from 'rxjs';
import {IStockSearch} from '@nusantara/models/products/stock-search';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends AbstractCrudService<IWarehouse> {

  baseUrl = '/api/fulfillment/warehouse';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  warehouseStockSearch(href: string): Observable<Array<IStockSearch>> {
    return this.httpClient
      .post<Array<IStockSearch>>(`/api/fulfillment/warehouse-stock/search/`, { product: href },{observe: 'body', responseType: 'json'});
  }

}
