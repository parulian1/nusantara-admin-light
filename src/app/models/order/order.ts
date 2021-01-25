import { ICoreOrder } from '@nusantara/models/order/core-order';

export interface IOrder extends ICoreOrder {
  customer: {
    name: string;
    href: string;
  };

  featuredProduct?: {
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

  cartTotals?: {
    grandTotal: number;
    subTotal: number;
    taxTotal: number;
    shippingTotal: number;
    discountTotal: number;
  };

  // this can be of any format.
  meta?: {
    paymentType: string; // actually a type?
    vaNumber: string;
    dateExpired: string;

  };

}

