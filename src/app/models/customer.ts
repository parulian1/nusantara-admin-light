import { IUser } from './user';
import { ICustomerProfile } from './customer-profile';

export interface ICustomer extends IUser {
  lastLogin: string;
  lifetimeValue: number;
  purchaseCount: number;
  profile: ICustomerProfile;
}
