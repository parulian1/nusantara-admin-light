import { INamedHrefEntity } from '@nusantara/models/base';
import { ProductOptionType } from '@nusantara/models/products/product-option-type.enum';

export interface IProductOption extends INamedHrefEntity {
  type: ProductOptionType;
  minimumLength: number;
  maximumLength: number;
  isActive: boolean;
  webhookCheckDomain: string;
  webhookPostCheckout: string;
}
