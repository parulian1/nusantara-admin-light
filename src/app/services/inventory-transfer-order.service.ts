import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { ITransferOrder } from '@nusantara/models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferOrderService extends AbstractCrudService<ITransferOrder> {

  baseUrl = '/api/fulfillment/transfer-order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
