import { INamedHrefEntity } from '@nusantara/models/base';
import { BannerGroupType } from '@nusantara/models/widgets/banner-group.type';
import { IBanner } from '@nusantara/models/widgets/banner';

export interface IBannerGroup extends INamedHrefEntity {
  type: BannerGroupType;
  banners: Array<IBanner>;
}
