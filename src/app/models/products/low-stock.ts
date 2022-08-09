import { INamedHrefEntity } from '@nusantara/models';

export interface ILowStock extends INamedHrefEntity {
  isActive: boolean;
  quantity: number;
  email: string;
  emails: Array<string>;
  customThreshold: boolean;
  customThresholdProducts: Array<ICustomThresholdProduct>;
}

export interface ILowStockProduct {
  id: number;
  name: string;
  upc: string;
  originalQuantity: number;
  latestStock: number;
  sublocationName: string;
  sublocationType: string;
  warehouseName: string;
  siteId: number ;
}

export interface ICustomThresholdProduct {
  product: ICustomThresholdProductDetail;
  amount: number;
}

export interface ICustomThresholdProductDetail extends INamedHrefEntity{
  upc: string;
}
