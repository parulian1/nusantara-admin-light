import { IOrderChildren } from '@nusantara/models/order/order-children';
import { ICoreOrder } from '@nusantara/models/order/core-order';

export interface IOrderDetail extends ICoreOrder {
  customer: {
    name: string;
    href: string;
    email: string;
  };

  children: IOrderChildren[];

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

  subtotalCost: number;
  discount: number;
  shippingCost: number;
}

