import { IThumbnailMeta} from './thumbnail-meta';

export interface ISnippet {
  publishedAt: string; // iso8601 datetime
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: IThumbnailMeta;
    medium: IThumbnailMeta;
    high: IThumbnailMeta;
    standard: IThumbnailMeta;
    maxres: IThumbnailMeta;
  };
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage: string;
  localized: {
    title: string;
    description: string;
  };
  defaultAudioLanguage: string;
}

