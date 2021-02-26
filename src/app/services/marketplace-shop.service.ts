import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import {
  IShop,
  IProductCategory,
  ILogistic,
  IAttributesMapping,
} from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceShopService {
  baseUrl = '/api/marketplace/shop';

  constructor(private httpClient: HttpClient) {}

  fetchList(
    page: number = 1,
    perPage?: number
  ): Observable<PagedResponse<IShop>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());
    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    return this.httpClient
      .get<IShop[]>(`${this.baseUrl}/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }

  fetchCategory(
    shopSlug: string,
    parentId?: number
  ): Observable<IProductCategory[]> {
    return parentId
      ? this.httpClient.get<IProductCategory[]>(
          `${this.baseUrl}/${shopSlug}/item-category/${parentId}/`
        )
      : this.httpClient.get<IProductCategory[]>(
          `${this.baseUrl}/${shopSlug}/item-category/`
        );
  }

  fetchAttribute(shopSlug: string, categoryId: number): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${shopSlug}/item-category/${categoryId}/attribute/`
    );
  }

  mapAttribute(
    formData: IAttributesMapping,
    shopSlug: string,
    productClassSlug: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/${shopSlug}/mapping-attribute/${productClassSlug}/`,
      formData
    );
  }

  fetchLogistic(shopSlug: string): Observable<ILogistic[]> {
    return this.httpClient.get<ILogistic[]>(
      `${this.baseUrl}/${shopSlug}/logistic/`
    );
  }

  patchLogistic(shopSlug: string, patchValue: any): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/${shopSlug}/logistic/`,
      patchValue
    );
  }

  getShopDetail(shopSlug: string): Observable<any> {
    return this.httpClient.get<IShop[]>(
      `${this.baseUrl}/${shopSlug}/`
    );
  }

  shopInAuthCallback(formData: FormData): Observable<any>{
    return this.httpClient.post(
      `/api/marketplace/shop-callback/`,
      formData
    );
  }

  shopCallback(formData: FormData, baseurl: string): Observable<any>{
    return this.httpClient.post(
      `${baseurl}/api/marketplace/shop-callback/`,
      formData
    );
  }
}
