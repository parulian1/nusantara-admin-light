import { INamedHrefEntity } from '@nusantara/models/base';
import { ProductPromotionType } from '@nusantara/models';

export interface IVoucher extends INamedHrefEntity {
  products: Array<INamedHrefEntity>;
  code: string;
  type: ProductPromotionType;
  amount: number;
  minimumOrderAmount: number;
  discountBase: string; // ??????!?!?
  maxUsed: string; // ?!?!???
  maxAmount: number;
  validTo: string;
  validFrom: string;
  isActive?: boolean;
  maxUsedQty?: number;
  customerGroups?: Array<INamedHrefEntity>;
}
