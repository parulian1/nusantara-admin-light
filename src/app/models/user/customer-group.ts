import { INamedHrefEntity } from '@nusantara/models/base';

import { CustomerGroupType } from './customer-group-type.enum';

export interface ICustomerGroup extends INamedHrefEntity {
  userCount: number;
  type: CustomerGroupType;
  timeThreshold?: string;
  amountThreshold?: number;
}
