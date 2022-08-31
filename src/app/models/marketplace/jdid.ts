export interface IJdidCredential {
  shopName: string;
  warehouse: number;
  marketplace: string;
  shopId: string;
}

export interface IJdidauthResponse {
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
  sellerKey: string;
  signatureKey: string;
}
