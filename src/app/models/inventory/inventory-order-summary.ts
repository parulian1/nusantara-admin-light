import { InventoryOrderType } from './inventory-order.type';
import { IBaseInventoryOrder } from '@nusantara/models/inventory/base-inventory-order';

export interface IInventoryOrderSummary extends IBaseInventoryOrder {
  type: InventoryOrderType;
}
