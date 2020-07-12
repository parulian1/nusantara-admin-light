import { INamedHrefEntity, IContentType } from '@nusantara/models/base';

/**
 * @see IContainer
 */
export interface IWidget extends INamedHrefEntity {
  container: string;
  contentType: IContentType;
  contentObject: {

  }
  objectId: number;
}
