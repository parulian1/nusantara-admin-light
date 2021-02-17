import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IVideoIntegration, IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoIntegrationService extends AbstractCrudService<IVideoIntegrationItem> {
  /**
   * baseUrl: used to get exist group for current site
   * otherBaseUrl: used to get detail, update, delete a video item
   */
  baseUrl = '/api/cms/content-video-item';
  contentVideoUrl = '/api/cms/content-video';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchFirstGroup(): Observable<string> {
    return this.httpClient.get<IVideoIntegration>(`${this.contentVideoUrl}/`).pipe(
      map(videoIntegration => videoIntegration.href)
    );
  }
}
