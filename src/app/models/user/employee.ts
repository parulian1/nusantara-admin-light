import { ICustomer } from '@nusantara/models';
import { INamedHrefEntity } from '@nusantara/models/base';
import {PagedResponse} from '@nusantara/core';

export interface IEmployee extends ICustomer {
  identityNumber: string;
  accessGroups: Array<INamedHrefEntity>;
  groups?: PagedResponse<INamedHrefEntity>;
  canUsePos?: boolean;
}
