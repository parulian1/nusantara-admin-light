import {IPaymentGateway} from '@nusantara/models';

export interface IOrderPaymentConfirm {
  href: string;
  order: string;
  orderDate: string;
  proofImage: string;
  shippingName: string;
  transferAmount: string;
  transferTo: string;
  paymentGateway?: IPaymentGateway;
}
