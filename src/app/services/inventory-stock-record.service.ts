import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IStockRecord } from '@nusantara/models/inventory';
import { Observable } from 'rxjs';
import { PagedResponse } from '@nusantara/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryStockRecordService extends AbstractCrudService<IStockRecord> {
  baseUrl = '/api/fulfillment/stock-record';
  // baseUrl = 'http://localhost:8000/stock-record';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchListWithFilter(query?: string, page: number = 1, perPage?: number, filter = {}): Observable<PagedResponse<IStockRecord>> {
    // create query params --> ?q=maybe&page=1
    let params = new HttpParams({ fromObject: filter });

    params = params.set('page', page.toFixed(0).toString());

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }


    return this.httpClient
      .get<IStockRecord[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }
}
