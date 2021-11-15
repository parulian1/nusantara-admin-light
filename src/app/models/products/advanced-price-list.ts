import { INamedHrefEntity } from '@nusantara/models';

import { AdvancedPriceListType } from '@nusantara/models/products/advanced-price-list-type';

export type amountSign = 'minus' | 'plus';

export interface IAdvancedPriceList extends INamedHrefEntity {
  warehouses: Array<INamedHrefEntity>;
  isActive?: boolean;
  isOnline: boolean;
  isOffline: boolean;
  type: AdvancedPriceListType;
  products: Array<IAdvancedPriceListProduct>;
}

export interface IAdvancedPriceListProduct {
  id?: number;
  product: IAdvancedPriceListProductDetail;
  amount?: number;
}

export interface IAdvancedPriceListProductDetail extends INamedHrefEntity {
  price: number;
  upc: string;
}
