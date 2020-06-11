export interface IProductAttribute {
  name: string;
  href: string;
  type: string;
  productClasses?: string[];
  minValue: number;
  maxValue: number;
}
