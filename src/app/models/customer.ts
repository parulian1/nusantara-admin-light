import { IUser } from './user';

export interface ICustomer extends IUser {
  lastLogin: string;
  lifetimeValue: number;
  purchaseCount: number;
}
