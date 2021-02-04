import { INamedHrefEntity } from '@nusantara/models/base';
import { IPaymentGatewayMeta } from '@nusantara/models/payment-gateway-meta';

export enum PaymentTypeChoices {
  MANUAL_TRANSFER = 'manual_transfer',
}

export interface IPaymentGateway extends INamedHrefEntity{
  description: string;
  logo: string;
  type: string;
  clientKey: string;
  serverKey: string;
  code?: string;
  accountNumber?: string;
  accountHoldNumber?: string;
  isActive: boolean;
  allowPos: boolean;
  meta: IPaymentGatewayMeta;
}
