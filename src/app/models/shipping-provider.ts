export interface IShippingProvider {
  href: string;
  isActive: boolean;
  name: string;
  type: string;
  description: string;
  icon: string;
  services: string[];
}
