import { INamedHrefEntity } from '@nusantara/models/base';

/**
 * A link to a product, which should be recommended to the user
 * when browsing a different product (this is different than a variant)
 */
export interface IRelatedProductSummary extends INamedHrefEntity {
  vendor: INamedHrefEntity;
  image: string;
}
