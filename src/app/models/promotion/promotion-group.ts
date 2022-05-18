import { INamedHrefEntity } from '../base';
import { ProductPromotionType } from '@nusantara/models';

export interface IPromoGroup extends INamedHrefEntity {
  description?: string;
  isActive: boolean;
  priority?: number;
  banner?: string;
  combinations?: IPromoGroupCombination[];
}


export interface IPromoGroupCombination extends INamedHrefEntity {
  type?: ProductPromotionType;
  validFrom?: string;
  validTo?: string;
}
