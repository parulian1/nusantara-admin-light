import { IHrefEntity, INamedHrefEntity } from '@nusantara/models/base';
import { IStockRecord } from './stock-record';
import { ReceivingOrderStatusType } from './receiving-order-status.type';
import { ReceivingOrderType } from './receiving-order.type';

export interface IReceivingOrder extends IHrefEntity {
  status: ReceivingOrderStatusType;
  createdBy: string;
  reviewedBy: string;
  warehouse: INamedHrefEntity;
  created: string;
  type: ReceivingOrderType;
  notes: string;
  stockRecords: Array<IStockRecord>;
}
