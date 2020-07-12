/**
 * A django content-type model.
 *
 * This is currently only intended for use from the cms/widgets
 * due to their use of a generic foreign key for returning widget
 * data.
 */
export interface IContentType {
  href: string;
  appLabel: string;
  model: string;
}
