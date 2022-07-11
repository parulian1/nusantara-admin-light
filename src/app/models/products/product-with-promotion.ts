import {INamedHrefEntity} from '@nusantara/models';

export interface IProductWithPromotion extends INamedHrefEntity {
  upc?: string;
  category?: INamedHrefEntity;
  vendor?: INamedHrefEntity;
  productClass?: INamedHrefEntity;
  promotionTag?: Array<IPromotionTag>;
}

export interface IPromotionTag {
  type: string;
  validFrom: string;
  validTo: string;
}
