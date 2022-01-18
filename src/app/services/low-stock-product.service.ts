import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResponse } from '@nusantara/core';
import { ILowStockProduct } from '@nusantara/models/products';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LowStockProductService  {
  protected httpClient: HttpClient;

  baseUrl = '/api/fulfillment/low-stock-product';

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  fetchListWithFilter(query?: string, page: number = 1, perPage?: number, filter = {}): Observable<PagedResponse<ILowStockProduct>> {
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
      .get<ILowStockProduct[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }
}
