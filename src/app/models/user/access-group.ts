import { INamedHrefEntity } from '@nusantara/models/base';
import { IEmailHrefUserEntity } from '@nusantara/models';

export interface IAccessGroup extends INamedHrefEntity {
  users?: IEmailHrefUserEntity[];
}
