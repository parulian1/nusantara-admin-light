export interface IPaymentGateway {
  description: string;
  href: string;
  logo: string;
  type: string;
  name: string;
  clientKey: string;
  serverKey: string;
}
