import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '../../../core';
import { IReceivingOrder} from '../../../models/inventory';
import { InventoryReceivingOrderService } from '../../../services/inventory-receiving-order.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryReceivingOrderDetailResolver extends AbstractDetailResolver<IReceivingOrder> {
  constructor(service: InventoryReceivingOrderService) { super(service); }
}
