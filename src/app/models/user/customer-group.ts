import { INamedHrefEntity } from '@nusantara/models/base';

import { CustomerGroupType } from './customer-group-type.enum';
import { IEmailHrefUserEntity } from "@nusantara/models";

export interface ICustomerGroup extends INamedHrefEntity {
  userCount: number;
  type: CustomerGroupType;
  timeThreshold?: string;
  amountThreshold?: number;
  customers?: IEmailHrefUserEntity[];
}
