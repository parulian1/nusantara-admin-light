import { INamedHrefEntity } from '../base';
import { ProductPromotionType } from './product-promotion.type';

export interface IProductPromotion extends INamedHrefEntity {
  products: Array<INamedHrefEntity>;
  isActive: boolean;
  type: ProductPromotionType;
  amount: number;
  minimumOrderAmount: number;
  maxAmount: number;
  isExclusive: boolean;
  validFrom: string;
  validTo?: string;
  priority?: number;
  banner?: string;
}
