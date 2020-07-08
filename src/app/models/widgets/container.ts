import { INamedHrefEntity } from '@nusantara/models/base';

import { ContainerType } from './container.type';

/**
 * A container for widgets which are to be displayed on a single page.
 */
export interface IContainer extends INamedHrefEntity {

  type: ContainerType;

  page: string;

  /**
   * A unique code used to identify this widget container.  Similar to a slug.
   */
  code: string;

  /**
   * All of the widgets that should be rendered within this container.
   */
  widgets: Array<any>;
}
