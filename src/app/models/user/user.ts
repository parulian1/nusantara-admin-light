import { INamedHrefEntity } from '@nusantara/models/base';

export interface IUser extends INamedHrefEntity {
  email: string;
  firstName: string;
  lastName: string;
  username: string;

  // meh.

  isStaff?: string;
  dateJoined?: string;
}
