import { INamedHrefEntity } from '../base';
import { ProductPromotionType, IProductBundling } from '@nusantara/models';

export interface IPromoGroup extends INamedHrefEntity {
  description?: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  priority?: number;
  banner?: string;
  combinations?: INamedHrefEntity[];
}
