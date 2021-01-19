import {IHrefEntity} from './base';

export interface IBlogFeedSetting extends  IHrefEntity {
  blogUrl: string;
  blogFeedUrl?: string;
  blogFeedCacheTime: number;
}
