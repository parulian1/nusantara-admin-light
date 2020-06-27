import { IProductMedia } from './product-media';
import { IPriceList } from '@nusantara/models/price-list';

/**
 * Anything that is available for sale.
 */
export interface IProduct {
  href: string;
  name: string;
  upc: string;
  description: string;
  vendor: string;
  productClass: string;
  media: IProductMedia[];
  weight: number;
  category: string;
  priceLists: Array<IPriceList>;
  // related[]
  // attributes
}
