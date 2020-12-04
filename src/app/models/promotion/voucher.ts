import { INamedHrefEntity } from '@nusantara/models/base';
import { ProductPromotionType } from './product-promotion.type';

export interface IVoucher extends INamedHrefEntity {
  products: Array<INamedHrefEntity>;
  code: string;
  type: ProductPromotionType;
  amount: number;
  discountBase: string; // ??????!?!?
  maxUsed: string; // ?!?!???
  maxAmount: number;
  validTo: string;
  validFrom: string;
}
