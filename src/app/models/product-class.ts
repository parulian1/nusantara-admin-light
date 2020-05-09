import { IProductAttribute } from './product-attribute';

export interface IProductClass {
  name: string;
  href: string;
  requiresShipping: boolean;
  trackStock: boolean;
  isPerishable: boolean;
  type: string;
  attributes: IProductAttribute[];
}
