import { IProductAttribute } from './product-attribute';
import { IProductOption } from './product-option';

export interface IProductClass {
  name: string;
  href: string;
  requiresShipping: boolean;
  trackStock: boolean;
  isPerishable: boolean;
  type: string;
  productCount?: number;
  attributes: IProductAttribute[];
  option?: IProductOption;
}
