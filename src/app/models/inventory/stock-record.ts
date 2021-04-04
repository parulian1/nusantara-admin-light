import { IHrefEntity, INamedHrefEntity } from '@nusantara/models/base';

export interface IStockRecord extends IHrefEntity {
  product: INamedHrefEntity;
  location: INamedHrefEntity;
  sku: string;
  locator: string[];
  originalQuantity: number;
  batchNumber: string;
  expiryDate: string;
  requestingStock?: number;
  notes?: string;
  reason?: string;
}
