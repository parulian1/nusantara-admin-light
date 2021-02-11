import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import { IShop, IShopAttributeMapping } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceProductClassService {
  baseUrl = '/api/marketplace/product-class';

  constructor(private httpClient: HttpClient) {}

  fetchList(
    shopSlug: string,
    page: number = 1,
    perPage?: number
  ): Observable<PagedResponse<IShop>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());
    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    return this.httpClient
      .get<IShop[]>(`${this.baseUrl}/${shopSlug}/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }

  fetchAttribute(
    productClassSlug: string
  ): Observable<IShopAttributeMapping> {
    return this.httpClient.get<IShopAttributeMapping>(
      `${this.baseUrl}/${productClassSlug}/attribute/`
    );
  }
}
