export interface IProductAttribute {
  name: string;
  href: string;
  type: string;
  productClass?: string;
  choices: string[];
  minValue: number;
  maxValue: number;
}
