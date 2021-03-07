export interface IShopifyCarrier {
  id: number;
  name: string;
  active: boolean;
  serviceDiscovery: boolean;
  carrierServiceType: string;
  adminGraphqlApiId: string;
  format?: string;
  callbackUrl?: string;
}
