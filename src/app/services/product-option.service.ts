import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductOptionService extends AbstractCrudService<products.IProductOption> {

  baseUrl = '/api/catalog/product-option';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetch(slug: string): Observable<products.IProductOption> {
    return this.httpClient.get<products.IProductOption>(
      `/api/catalog/product-option/${slug}/`,
      {observe: 'body', responseType: 'json'}
    );
  }

  fetchActiveProductOptions(): Observable<products.IProductOption[]> {

    const params = new HttpParams()
      .append('is_active', 'true')
      .append('per_page', '500');

    return this.httpClient
      .get<products.IProductOption[]>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json', params});
  }
}
