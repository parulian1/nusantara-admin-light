import { INamedHrefEntity } from '@nusantara/models/base';

export enum VideoIntegrationItemChoices {
  youtube = 'youtube',
}

/* on api we call it as `ContentVideoItem` */
export interface IVideoIntegrationItem extends INamedHrefEntity {
  id: number;
  name: string;
  description: string;
  contentGroup?: unknown;
  type: VideoIntegrationItemChoices;
  embededUrl: string;
  youtubeVideoId: string;
  sortPriority?: string;
  isActive?: boolean;
}
