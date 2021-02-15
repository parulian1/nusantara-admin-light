import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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
  baseUrl = '/api/cms/content-video';
  otherBaseUrl = '/api/cms/content-video-item';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchAll(query?: string): Observable<IVideoIntegrationItem[]> {
    const params = new HttpParams({fromObject: {per_page: '250'}});
    return this.httpClient.get<IVideoIntegration>(
      `${this.baseUrl}/`,
      {observe: 'body', responseType: 'json', params}).pipe(
        map((videoIntegration) => videoIntegration.contentItems),
    );
  }

  fetch(slug?: string): Observable<IVideoIntegrationItem> {
    let url = `${this.otherBaseUrl}/`;
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<IVideoIntegrationItem>(`${url}`, {observe: 'body', responseType: 'json'});
  }

  update2(entity: IVideoIntegrationItem): Observable<void> {
    return this.httpClient.patch<any>(entity.href, entity);
  }

  create2(entity: IVideoIntegrationItem): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/`, entity);
  }
}
