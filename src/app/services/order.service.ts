import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IOrder } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractCrudService<IOrder> {

  protected baseUrl = '/api/order/order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
