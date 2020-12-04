import { INamedHrefEntity } from '@nusantara/models/base';
import { IStockRecord } from './stock-record';
import { ReceivingOrderStatusType } from './receiving-order-status.type';
import { ReceivingOrderType } from './receiving-order.type';
import {IBaseInventoryOrder} from "@nusantara/models/inventory/base-inventory-order";

export interface IReceivingOrder extends IBaseInventoryOrder {
  status: ReceivingOrderStatusType;
  createdBy?: INamedHrefEntity;
  reviewedBy?: INamedHrefEntity;
  warehouse: INamedHrefEntity;
  created: string;
  type: ReceivingOrderType;
  notes: string;
  stockRecords: Array<IStockRecord>;
}
