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
  created?: string;
  receivingOrder?: INamedHrefEntity; // hmm
  cost: number;
}

export interface IStockRecordSearch {
  id?: string;
  sku?: string;
  originalQuantity?: string;
  latestStock?: string;
  productId?: string;
  productName?: string;
  productUpc?: string;
  productHref?: string;
  subLocationId?: string;
  subLocationName?: string;
  subLocationType?: string;
  warehouseSlug?: string;
  warehouseName?: string;
  siteId?: string;
}
