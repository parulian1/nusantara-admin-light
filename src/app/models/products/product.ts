import { IProductMedia } from './media';
import { IPriceList } from './price-list';
import { StructureType } from './structure.type';

/**
 * Anything that is available for sale.
 */
export interface IProduct {
  href: string;
  name: string;
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
  related: Array<string>;
  attributes: any;
}
