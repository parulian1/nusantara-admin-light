import { INamedHrefEntity } from '@nusantara/models/base';

/**
 * This is the primary widget grouping.
 */
export interface IWidgetBlock extends INamedHrefEntity {
  sortPriority: number;
  urlPath: string;
  widgets: Array<string>;
}
