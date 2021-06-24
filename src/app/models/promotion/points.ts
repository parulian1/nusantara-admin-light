import {INamedHrefEntity} from '@nusantara/models';
import {IPriceList} from '@nusantara/models/products';

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
  product: IProductPointsDetail;
  amount: number;
}

export interface IProductPointsDetail extends INamedHrefEntity{
  upc: string;
  priceLists: Array<IPriceList>;
}
