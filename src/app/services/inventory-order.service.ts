import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IInventoryOrderSummary } from '@nusantara/models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrderService extends AbstractCrudService<IInventoryOrderSummary> {

  baseUrl = '/api/fulfillment/inventory-order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
