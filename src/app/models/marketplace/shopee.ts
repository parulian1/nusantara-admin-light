export interface IShopeeCredential {
  partnerId: string;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  warehouse: number;
  marketplace: string;
}

export interface IShopeeAuthResponse {
  authenticationUrl: string;
  isConnected: boolean;
  partnerId: string;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  warehouseId: number;
  marketplace: string;
  href: string;
  splitVariant: boolean;
}
