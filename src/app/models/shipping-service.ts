/**
 * A particular type of service from a ShippingProvider.
 *
 * @see IShippingProvider
 */
import { INamedHrefEntity } from "@nusantara/models/base";

export interface IShippingService extends INamedHrefEntity {
  isActive: boolean;
  icon: string;
  minimumWeight: number;
  handlingFee: number;
  graceAmount: number;
  description: string;
}
