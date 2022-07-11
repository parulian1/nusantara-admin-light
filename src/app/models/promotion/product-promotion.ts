import { INamedHrefEntity } from '../base';
import { ProductPromotionType, IProductBundling, ProductPromotionStatusType } from '@nusantara/models';

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
  productBundlingBenefit?: Array<IProductBundling>;
  productBundlingCondition?: Array<IProductBundling>;
  multiplyItem?: boolean;
  appliedOnOnline: boolean;
  appliedOnOffline: boolean;
  customerGroups?: INamedHrefEntity[];
  promotionGroup?: INamedHrefEntity;
  status?: ProductPromotionStatusType;
}
