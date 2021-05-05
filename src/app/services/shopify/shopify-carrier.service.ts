import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IShopifyCarrier} from '@nusantara/models/shopify/shopify-carrier';

@Injectable({
  providedIn: 'root'
})
export class ShopifyCarrierService {

  protected httpClient: HttpClient;
  public readonly maxPageSize = 250;

  baseUrl = '/api/fulfillment/shopify/carrier-register';

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // retrieves a single object from the API based on it's slug
  fetchAll(): Observable<IShopifyCarrier[]> {

    return this.httpClient
      .get<IShopifyCarrier[]>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json'});
  }
}
