import { IHrefEntity, INamedHrefEntity } from '../base';
import { InventoryOrderStatusType } from '@nusantara/models/inventory/inventory-order-status.type';

export interface IBaseInventoryOrder extends IHrefEntity {
  createdBy?: INamedHrefEntity;
  reviewedBy?: INamedHrefEntity;
  warehouse: INamedHrefEntity;
  created: string;
  status: InventoryOrderStatusType;
}

export interface IInventoryFilterValue {
  date: {
    type: string,
    start: string,
    end: string,
  }
  status: string,
  type:string,
}
