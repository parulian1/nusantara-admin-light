import { Injectable } from '@angular/core';
import {AbstractCrudService, ErrorResult, SuccessCreatedResult} from '@nusantara/core';
import {IShopifyMessage} from '@nusantara/models';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopifyMessageService extends AbstractCrudService<IShopifyMessage>{

  baseUrl = '/api/order/shopify/message';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  process_message(messageId: number) {
    return this.httpClient
      .post<void>(`${this.baseUrl}/${messageId}/process_message/`, {});
  }
}
