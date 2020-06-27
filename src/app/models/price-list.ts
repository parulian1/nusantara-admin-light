import { PriceListType } from './price-list.type';
import { IPriceListRange } from './price-list-range';

export interface IPriceList {
  href: string;
  product: string;
  type: PriceListType;
  platforms: string[];
  locations: string[];
  isProgressive: boolean;
  ranges: IPriceListRange[];
}
