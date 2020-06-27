/**
 * Defines the price for a given purchase quantity of a product.
 * Ex, purchasing 1-10 products = 10.000 / product, 11-20 = 9.500 / product
 */
export interface IPriceListRange {
  href: string;
  priceList: string;
  price: number;
  minQuantity: number;
  maxQuantity: number;
}
