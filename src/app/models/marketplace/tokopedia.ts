export interface ITokopediaCredential {
  partnerKey: string;
  partnerId: string;
  fsId: number;
  warehouse: number;
  marketplace: string;
}


export interface ITokopediaAuthResponse {
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
  fsId: number;
}
