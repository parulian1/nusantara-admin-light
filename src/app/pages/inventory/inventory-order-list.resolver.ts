import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IInventoryOrderSummary } from '@nusantara/models/inventory';
import { InventoryOrderService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrderListResolver extends AbstractListResolver<IInventoryOrderSummary> {
  constructor(service: InventoryOrderService) { super(service); }
}
