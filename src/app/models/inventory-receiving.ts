import { InventoryReceivingStatusType } from './inventory-receiving-status.type';
import { IStockRecord } from './stock-record';

export interface IInventoryReceiving {
  href: string;
  status: InventoryReceivingStatusType;
  createdBy: string;
  finalizedBy: string;
  stockRecords: Array<IStockRecord>;
}
