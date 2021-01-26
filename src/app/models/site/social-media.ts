import {IHrefEntity} from '@nusantara/models';

export interface ISocialMedia extends IHrefEntity {
  type?: string;
  url?: string;
  logo?: string;
}
