import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import * as youtube from '@nusantara/models/google/youtube';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(protected httpClient: HttpClient) { }

  /**
   * Calls the YouTube Video.
   *
   * @param videoId
   */
  fetchYoutubeVideoMeta(videoId: string): Observable<youtube.IVideoList> {

    const params = new HttpParams(
      {fromObject: {key: environment.googleApiKey, id: videoId, part: 'snippet,contentDetails,player', }, }
    );

    return this.httpClient.get<youtube.IVideoList>(
      'https://www.googleapis.com/youtube/v3/videos',
      {observe: 'body', responseType: 'json', params}
    );
  }
}
