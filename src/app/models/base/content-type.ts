import { IHrefEntity } from './href-entity';
import { AppLabelType } from './app-label.type';
import { ModelType } from './model.type';

/**
 * A django content-type model.
 *
 * This is currently only intended for use from the cms/widgets
 * due to their use of a generic foreign key for returning widget
 * data.
 */
export interface IContentType extends IHrefEntity {
  appLabel: AppLabelType;
  model: ModelType;
}
