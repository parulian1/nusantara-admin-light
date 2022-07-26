import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceShopService {
  baseUrl = '/api/marketplace/shop';
  syncUrl = '/api/marketplace/shop-sync'

  constructor(private httpClient: HttpClient) {}

  fetchList(
    page: number = 1,
    perPage?: number
  ): Observable<PagedResponse<marketplace.IShop>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());
    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    return this.httpClient
      .get<marketplace.IShop[]>(`${this.baseUrl}/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }

  fetchCategory(
    shopSlug: string,
    parentId?: number,
    parentCode?:string
  ): Observable<marketplace.IProductCategory[]> {
    return parentId
      ? this.httpClient.get<marketplace.IProductCategory[]>(
          `${this.baseUrl}/${shopSlug}/item-category/${parentId}/`
        )
      : parentCode ?
        this.httpClient.get<marketplace.IProductCategory[]>(
          `${this.baseUrl}/${shopSlug}/item-category/${parentCode}/`
        )
        :this.httpClient.get<marketplace.IProductCategory[]>(
            `${this.baseUrl}/${shopSlug}/item-category/`
          );
  }

  fetchAttribute(shopSlug: string, categoryId?: number, categoryCode?:string): Observable<any> {
    if (categoryCode){
      return this.httpClient.get<any>(
        `${this.baseUrl}/${shopSlug}/item-category/${categoryCode}/attribute/`
      );
    }else {
      return this.httpClient.get<any>(
        `${this.baseUrl}/${shopSlug}/item-category/${categoryId}/attribute/`
      );
    }
  }

  mapAttribute(
    formData: marketplace.IAttributesMapping,
    shopSlug: string,
    productClassSlug: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/${shopSlug}/mapping-attribute/${productClassSlug}/`,
      formData
    );
  }

  fetchLogistic(shopSlug: string): Observable<marketplace.ILogistic[]> {
    return this.httpClient.get<marketplace.ILogistic[]>(
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
    return this.httpClient.get<marketplace.IShop[]>(
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
      `https://${baseurl}/api/marketplace/shop-callback/`,
      formData
    );
  }

  // getSyncType(shopSlug: string, typeSync: string): Observable<any> {
  //   return this.httpClient.get<any>(
  //     `${this.syncUrl}/${shopSlug}/${typeSync}/`
  //   );
  // }

  // synchronizeSyncType(shopSlug: string, typeSync: string, formData): Observable<any> {
  //   return this.httpClient.post(
  //     `${this.syncUrl}/${shopSlug}/${typeSync}/`, formData
  //   );
  // }
}
