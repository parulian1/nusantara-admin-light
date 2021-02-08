import { INamedHrefEntity } from '@nusantara/models/base';
import { IProductMedia } from './media';
import { IPriceList } from './price-list';
import { StructureType } from './structure.type';
import { IVariantSummary } from './variant-summary';
import { IRelatedProductSummary } from './related-product-summary';
import { IProductSubscription } from './product-subscription';

/**
 * Anything that is available for sale.
 */

export interface IDimensions {
  currentHeight: number;
  currentLength: number;
  currentWidth: number;
}

export interface IProduct extends INamedHrefEntity {
  upc: string;
  description: string;
  structure: StructureType;
  parent?: string;
  children: Array<string>;
  vendor: INamedHrefEntity;
  productClass: INamedHrefEntity;
  media: IProductMedia[];
  weight: number;
  category: INamedHrefEntity;
  priceLists: Array<IPriceList>;
  related: Array<IRelatedProductSummary>;
  attributes: {[key: string]: string|number|boolean};
  variants: Array<IVariantSummary>;
  tags: Array<string>;
  seoMeta: string;
  seoDescription: string;
  subscription: IProductSubscription;
  isActive?: boolean;
  dimensions: IDimensions;
}
