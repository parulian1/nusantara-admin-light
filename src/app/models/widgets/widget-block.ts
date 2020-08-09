import { INamedHrefEntity } from '@nusantara/models/base';
import { ShellSectionType } from './shell-section.type';
import { IWidget } from './widget';

/**
 * This is the primary widget grouping.
 */
export interface IWidgetBlock extends INamedHrefEntity {
  sortPriority: number;
  urlPath: string;
  shellSection: ShellSectionType;
  widgets: Array<IWidget>;
}
