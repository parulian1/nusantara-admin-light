import { INamedHrefEntity } from '@nusantara/models/base';

export interface ICategory extends INamedHrefEntity {
  pathName: string;
  productCount?: number;
  depth: number;
  image: string;
  parent: string;
  sourceMappings: Array<string>;
  isActive: boolean;
}
