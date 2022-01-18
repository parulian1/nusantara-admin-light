import { INamedHrefEntity } from '@nusantara/models';

export interface ILowStock extends INamedHrefEntity {
  isActive: boolean;
  quantity: number;
  email: string;
  emails: Array<string>;
}

export interface IEmailAlert {
  email: string;
}

export interface ILowStockProduct {
  id: number;
  name: string;
  upc: string;
  originalQuantity: number;
  latestStock: number;
  sublocationName: string;
  warehouseName: string;
  siteId: number ;
}
