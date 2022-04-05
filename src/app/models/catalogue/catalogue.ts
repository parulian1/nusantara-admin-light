import {INamedHrefEntity} from '@nusantara/models';

export interface ICatalogue extends INamedHrefEntity {
  image: string;
  slug: string;
  description: string;
  file?: string;
  fileName?: string;
  sortPriority: number;
  isActive: boolean;
  download?: string;
}
