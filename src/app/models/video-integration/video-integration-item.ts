import { INamedHrefEntity } from '@nusantara/models/base';

/* on api we call it as `ContentVideoItem` */
export interface IVideoIntegrationItem extends INamedHrefEntity {
  id: number;
  name: string;
  contentGroup: unknown;
  youtubeVideoId: string;
  sortPriority?: string;
}
