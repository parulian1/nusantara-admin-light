import { KindType } from '../kind.type';

import { ISnippet } from './snippet';
import { IContentDetails } from './content-details';
import { IPlayer } from './player';

export interface IVideo {
  kind: KindType;
  etag: string;
  id: string;
  snippet: ISnippet;
  contentDetails: IContentDetails;
  player: IPlayer;
}
