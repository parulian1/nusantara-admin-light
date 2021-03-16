import { ICustomer } from '@nusantara/models';
import { INamedHrefEntity } from '@nusantara/models/base';

export interface IEmployee extends ICustomer {
  identityNumber: string;
  accessGroups: Array<INamedHrefEntity>;
  canUsePos?: boolean;
  pin: string;
}
