import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IAdjustment } from '@nusantara/models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryAdjustmentOrderService extends AbstractCrudService<IAdjustment> {
  baseUrl = '/api/fulfillment/adjustment-order';
  // baseUrl = 'http://localhost:8000/adjustment-order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
