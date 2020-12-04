import { Injectable } from '@angular/core';

import { AbstractListResolver } from '../../../core';
import { IInventoryOrderSummary } from '../../../models/inventory';
import { InventoryOrderService } from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrderListResolver extends AbstractListResolver<IInventoryOrderSummary> {
  constructor(service: InventoryOrderService) { super(service); }
}
