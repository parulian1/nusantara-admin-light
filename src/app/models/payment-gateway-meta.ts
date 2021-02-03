export interface IPaymentGatewayMeta {
  type: 'cash' | 'edc' | 'e_wallet' | 'gift_voucher' | 'point' | 'sales';
  eWallets?: Array<string>;
  banks?: Array<string>;
}
