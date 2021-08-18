import { IProductAttribute } from './product-attribute';
import { IProductOption } from './product-option';
import {INamedHrefEntity} from '@nusantara/models';

export interface IProductClass extends INamedHrefEntity{
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
