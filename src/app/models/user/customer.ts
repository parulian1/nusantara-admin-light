import { IUser } from './user';
import { ICustomerProfile } from './customer-profile';
import { ICustomerGroup } from './customer-group';

export interface ICustomer extends IUser {
  lastLogin: string;
  phoneNumber: string;
  homePhoneNumber: string;
  profile: ICustomerProfile;
  customerGroups: ICustomerGroup[];
}
