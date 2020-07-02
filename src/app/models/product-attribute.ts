import { ProductAttributeType } from './product-attribute.type';

/**
 * Defines an attribute which can be defined on a product.
 * This object **is not** the value of the attribute, it is purely
 * the definition of what the attribute can be.
 *
 * These objects are only directly assigned to a product class
 *
 * @see IProductClass
 */
export interface IProductAttribute {
  name: string;
  href: string;
  type: ProductAttributeType;
  productClasses?: string[];
  minValue: number;
  maxValue: number;
  isSearchable: boolean;
  isFilterable: boolean;
}
