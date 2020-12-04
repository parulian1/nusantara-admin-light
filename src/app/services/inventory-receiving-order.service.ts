import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IReceivingOrder } from '@nusantara/models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryReceivingOrderService extends AbstractCrudService<IReceivingOrder> {

  baseUrl = '/api/fulfillment/receiving-order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
