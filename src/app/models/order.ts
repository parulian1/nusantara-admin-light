import { IHrefEntity } from '@nusantara/models/base';

import { OrderType } from './order.type';
import { OrderStatusType } from './order-status.type';

export interface IOrder extends IHrefEntity {
  orderNumber: string;
  customer: string;
  // customer: {
  //   name: string;
  //   href: string;
  // };

  created: string;

  type: OrderType;
  status: OrderStatusType;

  // todo: customer where?
  // todo: if child, parent where?

  // parent: string;
  // children: string[];
  // warehouse: string;
  //
  // discount: number;
  // separateDelivery: boolean;
  //
  // payments: Array<string>;
  //
  // shippingMethod: string;
  // shippingCost: number;

  totalItems: number;
  featuredProduct: {
    price: number,
    quantity: 5,
    weight: number,
    notes: string,
    product: {
      href: string,
      name: string,
      image: string
    }
  };

  children: string[];

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

  cartTotals: {
    grandTotal: number;
    subTotal: number;
    taxTotal: number;
    shippingTotal: number;
    discountTotal: number;
  };

  // this can be of any format.
  meta: {
    paymentType: string; // actually a type?
    vaNumber: string;
    dateExpired: string;

  };

}

