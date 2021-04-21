import {ICompanyAddress, INamedHrefEntity, ISiteConfigExtra, ISocialMedia} from '@nusantara/models';

export interface ISiteConfig extends INamedHrefEntity {
  logo?: string;
  gaAccountId?: string;
  gaAccountType?: 'ga' | 'gtm';
  favicon?: string;
  tagLine?: string;
  customerServiceEmail?: string;
  extraConfig: ISiteConfigExtra;
  socialMedias: ISocialMedia[];
  licenseType?: string;
  companyName?: string;
  phoneNumber?: string;
  companyAddress?: ICompanyAddress;
}
