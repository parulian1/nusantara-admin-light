import { IHrefEntity } from '../base';

import { OrderType } from './order.type';
import { OrderStatusType } from './order-status.type';

export interface ICoreOrder extends IHrefEntity {
  orderNumber: string;

  created: string;

  type: OrderType;
  status: OrderStatusType;

  totalItems: number;

  orderPayment: {
    completedDate: string;
    amount: number;
    status: 'paid' | 'unpaid';
    notes: string;
    paymentGateway: {
      name: string;
      description: string;
      logo: string;
      type: string; // todo: actually a type here?
      guide: string;
    };
  };

  orderAddress: {
    city: string;
    country: string;
    district: string;
    phoneNumber: string;
    shipToName: string;
    state: string;
    street: string;
    zipcode: string;
  };

}

