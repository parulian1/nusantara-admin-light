import {INamedHrefEntity} from "@nusantara/models";

export interface IProductBundle {
  product: IProductBundleInfo;
  quantity: number;
  price?: number;
}

export interface IProductBundleInfo extends INamedHrefEntity {
  isActive: boolean;
  defaultImage?: string;
  defaultVideo?: string;
  productClass: string;
  vendor?: string;
  category?: string;
  defaultPrice?: number;
  upc?: string;
  weight?: number;
}
