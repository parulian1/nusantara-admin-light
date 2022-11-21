import { INamedHrefEntity } from '@nusantara/models';
import { IProductMedia } from '@nusantara/models/products/media';

export interface IProductBundle {
  product: IProductBundleInfo;
  quantity: number;
  price?: number;
}

export interface IProductBundleInfo extends INamedHrefEntity {
  isActive: boolean;
  productClass: string;
  vendor?: string;
  category?: string;
  upc?: string;
  skuforstok?: string;
  weight?: number;
  media?: IProductMedia[];
  defaultPrice?: number;
}
