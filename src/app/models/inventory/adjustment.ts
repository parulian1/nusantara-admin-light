import { IHrefEntity, INamedHrefEntity, INamedHrefEntityWarehouse } from '@nusantara/models/base';
import { IStockRecord } from '@nusantara/models/inventory/stock-record';


export type AdjustmentOrderStatusType =
  'pending' |
  'approved' |
  'rejected';

export type AdjustmentOrderType = 'manual' | 'automatic';


export interface IAdjustmentUser extends INamedHrefEntity {
  username?: string;
}

export interface IAdjustmentStockRecordReadOnly extends IStockRecord {
  reason: string;
  notes: string;
  adjustmentQuantity: number;
}


export interface IAdjustment extends IHrefEntity {
  type: AdjustmentOrderType;
  status: AdjustmentOrderStatusType;
  warehouse: INamedHrefEntityWarehouse;
  createdBy?: IAdjustmentUser;
  reviewedBy?: IAdjustmentUser;
  created: string;
  stockRecords: IStockRecord[];
}

export interface IAdjustmentReadOnly extends IAdjustment {
  stockRecords: IAdjustmentStockRecordReadOnly[];
}
