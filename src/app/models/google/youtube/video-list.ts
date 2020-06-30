import { KindType } from '../kind.type';
import { IVideo } from './video';

export interface IVideoList {
  kind: KindType;
  etag: string;
  items: Array<IVideo>;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}
