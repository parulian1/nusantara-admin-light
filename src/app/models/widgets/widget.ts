import { INamedHrefEntity } from '@nusantara/models/base';

/**
 * @see IContainer
 */
export interface IWidget extends INamedHrefEntity {
  container: string;
}
