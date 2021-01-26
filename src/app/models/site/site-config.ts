import { INamedHrefEntity, ISiteConfigExtra, ISocialMedia } from '@nusantara/models';

export interface ISiteConfig extends INamedHrefEntity {
  logo?: string;
  gaAccountId?: string;
  favicon?: string;
  tagLine?: string;
  customerServiceEmail?: string;
  extraConfig: ISiteConfigExtra;
  socialMedias: ISocialMedia[];
}
