import { INamedHrefEntity } from '@nusantara/models/base';

export interface IPageLinks extends INamedHrefEntity {
  url: string;
  icon: string;
  children: Array<IPageLinks>;
}
