import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService, PagedResponse } from '@nusantara/core';
import { products } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service for product CRUD.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends AbstractCrudService<products.IProduct> {

  baseUrl = '/api/catalog/product';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Same as fetchList, but only fetches **only** parent products (excludes variants).
   */
  fetchParentList(query?: string, page: number = 1, perPage?: number): Observable<PagedResponse<products.IProduct>> {

    let params = new HttpParams({fromObject: {
      page: page.toFixed(0).toString(),
    }});

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    return this.httpClient
      .get<products.IProduct[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }

}
