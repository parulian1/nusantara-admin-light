import { INamedHrefEntity } from '@nusantara/models/base';
import { BannerType } from '@nusantara/models/widgets/banner.type';

/**
 * A large image displayed on a single web page.
 */
export interface IBanner extends INamedHrefEntity {
  description: string;
  image: string;
  clickUrl: string;
  isActive: boolean;
  sortPriority: number;
}
