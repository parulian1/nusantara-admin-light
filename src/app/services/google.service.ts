import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { google } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private httpClient: HttpClient;

  constructor(
    protected httpBackend: HttpBackend,
  ) {
    this.httpClient = new HttpClient(httpBackend);
  }

  fetchYoutubeVideoMeta(videoId: string): Observable<google.youtube.IVideoList> {

    const params = new HttpParams({ fromObject: {
      key: environment.googleApiKey,
      id: videoId,
      part: 'snippet,contentDetails,player',
    }});

    return this.httpClient.get<google.youtube.IVideoList>(
      'https://www.googleapis.com/youtube/v3/videos',
      {observe: 'body', responseType: 'json', params}
    );
  }
}
