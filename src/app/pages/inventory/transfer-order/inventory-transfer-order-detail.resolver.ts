import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ITransferOrder } from '@nusantara/models/inventory';
import { InventoryTransferOrderService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransferOrderDetailResolver extends AbstractDetailResolver<ITransferOrder> {
  constructor(service: InventoryTransferOrderService) { super(service); }
}
