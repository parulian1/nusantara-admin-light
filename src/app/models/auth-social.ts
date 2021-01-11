import {IHrefEntity} from '@nusantara/models/base';

export class IAuthSocial implements IHrefEntity{
  authType: string;
  appKey: string;
  appSecret: string;
  href: string;
  isActive?: boolean;
}
