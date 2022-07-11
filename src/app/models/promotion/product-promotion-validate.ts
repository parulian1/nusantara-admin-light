import {
  IHrefEntity, INamedHrefEntity,
  IProductBundling,
  ProductPromotionType
} from '@nusantara/models';

export interface IProductPromotionValidate extends IHrefEntity {
  products: Array<INamedHrefEntity>;
  isActive: boolean;
  type: ProductPromotionType;
  validFrom?: string;
  validTo?: string;
  productBundlingBenefit?: Array<IProductBundling>;
  productBundlingCondition?: Array<IProductBundling>;
  multiplyItem?: boolean;
  appliedOnOnline: boolean;
  appliedOnOffline: boolean;
}
