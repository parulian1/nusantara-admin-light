import { IShippingService } from './shipping-service';

export interface IShippingProvider {
  href: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  icon: string;
  services: IShippingService[];
  authUser?: string;
  authPass?: string;
}
