import { IHrefEntity } from '@nusantara/models/base';

import { OrderType } from './order.type';
import { OrderStatusType } from './order-status.type';

export interface IOrder extends IHrefEntity {
  orderNumber: string;
  customer: string;

  type: OrderType;
  status: OrderStatusType;

  parent: string;
  children: string[];
  warehouse: string;

  discount: number;
  separateDelivery: boolean;

  payments: Array<string>;

  shippingMethod: string;
  shippingCost: number;
}
