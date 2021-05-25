export interface IPaymentGatewayMeta {
  type: 'cash' | 'edc' | 'e_wallet' | 'gift_voucher' | 'point' | 'sales' | 'salary_deduction';
  eWallets?: string;
  banks?: string;
}
