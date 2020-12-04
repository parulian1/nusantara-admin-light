import { INamedHrefEntity } from '@nusantara/models/base';
import { EmailHrefUserEntity } from '@nusantara/models';

export interface IAccessGroup extends INamedHrefEntity {
  users?: EmailHrefUserEntity[];
}
