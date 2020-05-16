import { CustomerGroupType } from './customer-group-type.enum';

export interface ICustomerGroup {
  name: string;
  href: string;
  userCount: number;
  type: CustomerGroupType;
  timeThreshold?: string;
  amountThreshold?: number;
}
