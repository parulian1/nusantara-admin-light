import { INamedHrefEntity } from '@nusantara/models/base';

export interface IVariantSummary extends INamedHrefEntity {
  image: string;
  attributes: {[key: string]: string|number|boolean};
}
