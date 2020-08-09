import { INamedHrefEntity, IContentType } from '@nusantara/models/base';
import { IBannerGroup } from './banner-group';

/**
 * @see IContainer
 */
export interface IWidget extends INamedHrefEntity {
  block: string;
  contentType: IContentType;
  contentObject: IBannerGroup;
  objectId: number;
  isActive: boolean;
  sortPriority: number;
}
