import { INamedHrefEntity } from '@nusantara/models/base';
import { IProductMedia } from './media';
import { IPriceList } from './price-list';
import { StructureType } from './structure.type';
import { IVariantSummary } from './variant-summary';
import { IRelatedProductSummary } from './related-product-summary';

/**
 * Anything that is available for sale.
 */
export interface IProduct extends INamedHrefEntity {
  upc: string;
  description: string;
  structure: StructureType;
  parent?: string;
  children: Array<string>;
  vendor: string;
  productClass: string;
  media: IProductMedia[];
  weight: number;
  category: string;
  priceLists: Array<IPriceList>;
  related: Array<IRelatedProductSummary>;
  attributes: {[key: string]: string|number|boolean};
  variants: Array<IVariantSummary>;
}
