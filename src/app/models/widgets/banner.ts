import { INamedHrefEntity } from '@nusantara/models/base';
import { BannerGroupType } from '@nusantara/models/widgets/banner-group.type';

/**
 * A large image displayed on a single web page.
 */
export interface IBanner extends INamedHrefEntity {
  description: string;
  image: string;
  clickUrl: string;
  isActive: boolean;
  sortPriority: number;
  pk: number;

  group: INamedHrefEntity;
}
