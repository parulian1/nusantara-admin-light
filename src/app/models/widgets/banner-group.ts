import { INamedHrefEntity } from '@nusantara/models/base';
import { BannerGroupType } from '@nusantara/models/widgets/banner-group.type';
import { banner } from '@nusantara/models';

export interface IBannerGroup extends INamedHrefEntity {
  type: BannerGroupType;
  banners?: Array<banner.IBanner>;
  pk?: number;
}
