import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IInventoryOrderSummary } from '@nusantara/models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryReceivingService extends AbstractCrudService<IInventoryOrderSummary> {

  baseUrl = '/api/fulfillment/receiving-order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
