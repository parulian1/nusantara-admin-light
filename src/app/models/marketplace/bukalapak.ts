export interface IBukalapakCredential {
  partnerKey: string;
  partnerId: string;
  username: string;
  warehouse: number;
  marketplace: string;
}


export interface IBukalapakAuthResponse {
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
  sellerEmail: string;
}
