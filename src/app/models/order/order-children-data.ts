import { IHrefEntity } from '../base';
import { IOrderChildrenLineItem } from './order-children-line-item';

export interface IOrderChildrenData extends IHrefEntity {
  lineItems: IOrderChildrenLineItem[];
  shipmentHistory?: {
    awbNumber: string;
    href: string;
    shippingLabelUrl?: string;
  };
  shippingMethod: string;
  status: string;
  marketplaceRedirectHref?: string;
}
