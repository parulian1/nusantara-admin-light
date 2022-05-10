export interface ITiktokCredential {
  shopName: string;
  warehouse: number;
  marketplace: string;
  shopCode: string;
}

export interface ITiktokAuthResponse {
  marketplace: string;
  partnerId: number;
  partnerKey: string;
  redirectUrl: string;
  shopId: number;
  isConnected: boolean;
  authenticationUrl: string;
  splitVariant: boolean;
  href: string;
  sellerEmail: string;
  warehouseId: number;
  fsId: number;
  shopCode: string;
  shopName: string;
}
