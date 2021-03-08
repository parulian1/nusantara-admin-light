import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
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
      .post<Array<IStockSearch>>(`/api/fulfillment/warehouse-stock/search/`,
        { product: href },
        { observe: 'body', responseType: 'json' }
        );
  }

  warehouseStockSearchWithDetails(href: string): Observable<Array<IStockSearch>> {
    const params = new HttpParams({fromObject: {details: 'true'}});
    return this.httpClient
      .post<Array<IStockSearch>>(`/api/fulfillment/warehouse-stock/search/`,
        { product: href },
        { observe: 'body', responseType: 'json', params: params }
        );
  }

  /*
   * Warehouse by user
   */
  fetchAllByUser(username: string): Observable<IWarehouse[]> {
    const params = new HttpParams({fromObject: {per_page: '250'}});
    return this.httpClient.get<IWarehouse[]>(`/api/fulfillment/user/${username}/warehouse/`,
      {observe: 'body', responseType: 'json', params});
  }

  createEmployee(warehouseSlug: string, employeeData: { user: string }): Observable<void> {
    return this.httpClient.post<any>(
      `/api/fulfillment/warehouse/${warehouseSlug}/user/`, {...employeeData}
    );
  }
  deleteEmployee(warehouseSlug: string, username: string): Observable<void> {
    return this.httpClient.delete<any>(
      `/api/fulfillment/warehouse/${warehouseSlug}/user/${username}/`,
    );
  }
}
