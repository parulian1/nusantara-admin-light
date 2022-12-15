export interface IBlibliCredential {
  shopName: string;
  warehouse: number;
  marketplace: string;
  shopCode: string;
  sellerEmail:string;
  signatureKey:string;
  sellerKey:string;
}

export interface IBlibliauthResponse {
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
