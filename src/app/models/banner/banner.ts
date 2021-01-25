import { INamedHrefEntity } from '@nusantara/models/base';
import { banner } from '@nusantara/models';

export interface IBanner extends INamedHrefEntity{
  image: string;
  phoneImage: string;
  tabletImage: string;
  type: banner.BannerTypeEnum;
  isActive: boolean;
  validFrom: string;
  validTo: string;
  clickUrl: string;
  displayHomepage: boolean;
  description?: string;
  group?: string;
  sortPriority?: number;
}

