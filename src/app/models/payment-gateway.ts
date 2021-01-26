import { INamedHrefEntity } from '@nusantara/models/base';

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
}
