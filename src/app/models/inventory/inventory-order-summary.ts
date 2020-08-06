import { IHrefEntity, INamedHrefEntity } from '@nusantara/models/base';
import { InventoryOrderStatusType } from './inventory-order-status.type';
import { InventoryOrderType } from './inventory-order.type';

export interface IInventoryOrderSummary extends IHrefEntity {
  status: InventoryOrderStatusType;
  type: InventoryOrderType;
  createdBy: INamedHrefEntity;
  reviewedBy: INamedHrefEntity;
  warehouse: INamedHrefEntity;
  created: string;
}
