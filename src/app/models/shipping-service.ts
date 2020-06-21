/**
 * A particular type of service from a ShippingProvider.
 *
 * @see IShippingProvider
 */
export interface IShippingService {
  href: string;
  isActive: boolean;
  name: string;
  icon: string;
  minimumWeight: number;
  handlingFee: number;
  graceAmount: number;
  description: string;
}
