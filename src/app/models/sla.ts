import { INamedHrefEntity } from '@nusantara/models/base';

export interface ISla extends INamedHrefEntity {
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  sortPriority: string;
}
