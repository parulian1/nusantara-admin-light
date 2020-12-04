import { IHrefEntity, INamedHrefEntity } from '@nusantara/models/base';
import { IProductMedia } from '../products/media';

export interface ITheme extends INamedHrefEntity {
  slug: string;
  subscriptionType: string;
  price?: number;
  description?: string;
  media: IProductMedia[];
  isActive?: boolean;
}
