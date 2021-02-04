import {INamedHrefEntity} from '@nusantara/models';
import {IProduct} from '@nusantara/models/products';

export interface IPoints extends INamedHrefEntity {
  transactionAmount: number;
  point: number;
  rounding: string;
  appliedOnOnline: boolean;
  appliedOnOffline: boolean;
  appliedOnApps: boolean;
  expireType: string;
  expireAt: string;
  products: Array<IProductPoints>;
  isActive: boolean;
}

export interface IProductPoints {
  product: INamedHrefEntity;
  amount: number;
}
