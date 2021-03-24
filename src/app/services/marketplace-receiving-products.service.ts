import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceReceivingProductsService {
  baseUrl = '/api/marketplace/receiving-products';

  constructor(private httpClient: HttpClient) {}

  fetch(id: string): Observable<marketplace.IReceivingOrderDetail> {
    return this.httpClient.get<marketplace.IReceivingOrderDetail>(
      `${this.baseUrl}/${id}/all/products/`,
      {
        observe: 'body',
        responseType: 'json',
      }
    );
  }

  fetchProducts(
    page: number = 1,
    id: string,
    filter: string = 'all'
  ): Observable<PagedResponse<marketplace.IReceivingProduct>> {
    const params = new HttpParams().set('page', page.toFixed(0).toString());

    return this.httpClient
      .get<marketplace.IReceivingProduct[]>(`${this.baseUrl}/${id}/${filter}/products/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(
        map((resp) => {
          const detail = (Object.assign(
            {},
            resp.body
          ) as unknown) as marketplace.IReceivingOrderDetail;
          // retrieve only products as array
          const productResp = { ...resp, body: detail.products };

          return new PagedResponse(
            productResp as HttpResponse<marketplace.IReceivingProduct[]>
          );
        })
      );
  }

  fetchShops(
    page: number = 1,
    id: string
  ): Observable<PagedResponse<marketplace.IShopErrorDetail>> {
    // fetch shop in reponse using 'error-authentication' filter
    const filter = 'error-authentication';
    const params = new HttpParams().set('page', page.toFixed(0).toString());

    return this.httpClient
      .get<marketplace.IShopErrorDetail[]>(`${this.baseUrl}/${id}/${filter}/products/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(
        map((resp) => {
          const detail = (Object.assign(
            {},
            resp.body
          ) as unknown) as marketplace.IReceivingOrderDetail;
          // retrieve only shops as array
          const productResp = { ...resp, body: detail.shops };

          return new PagedResponse(
            productResp as HttpResponse<marketplace.IShopErrorDetail[]>
          );
        })
      );
  }

  updateAllTimeoutError(orderId: string): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/${orderId}/all-timeout/`,
      null
    );
  }

  updateTimeoutError(productId: number): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/${productId}/timeout/`,
      null
    );
  }
}
