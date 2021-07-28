import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IShopifyWebhook} from '@nusantara/models/shopify/shopify-webhook';

@Injectable({
  providedIn: 'root'
})
export class ShopifyWebhookService {

  protected httpClient: HttpClient;
  public readonly maxPageSize = 250;

  baseUrl = '/api/order/shopify/webhook';

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // retrieves a single object from the API based on it's slug
  fetchAll(): Observable<IShopifyWebhook[]> {

    return this.httpClient
      .get<IShopifyWebhook[]>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json'});
  }

  registerHook(): Observable<any> {
    return this.httpClient
      .post(`${this.baseUrl}/`, {}, {observe: 'body', responseType: 'json'});
  }

  registerCarrier(): Observable<any> {
    return this.httpClient
      .post(`/api/fulfillment/shopify/carrier-register/`, {}, {observe: 'body', responseType: 'json'});
  }
}
