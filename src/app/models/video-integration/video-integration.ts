import { INamedHrefEntity } from '@nusantara/models/base';
import { IVideoIntegrationItem } from './video-integration-item';

/* on api we call it as `ContentVideoGroup` */
export interface IVideoIntegration extends INamedHrefEntity {
  contentItems?: IVideoIntegrationItem[];
}
