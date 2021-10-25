import { INamedHrefEntity } from '@nusantara/models';
import { AdvancedPriceListType } from '@nusantara/models/products/advanced-price-list-type';

export interface IAdvancedPriceList extends INamedHrefEntity {
  warehouses: Array<INamedHrefEntity>;
  isActive?: boolean;
  subLocation: Array<INamedHrefEntity>;
  type: AdvancedPriceListType;
  products: Array<IAdvancedPriceListProduct>;
}

export interface IAdvancedPriceListProduct extends INamedHrefEntity {
  upc: string;
  defaultPrice: number;
  modifyAmount?: number;
}
