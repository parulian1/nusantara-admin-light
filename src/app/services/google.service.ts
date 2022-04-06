import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

import {google} from '@nusantara/models';
import {IYoutubeOembed} from '@nusantara/models/youtube-oembed';

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

  getOembedDataByUrl(videoUrl: string): Observable<HttpResponse<IYoutubeOembed>> {
    const baseUrl = `https://www.youtube.com`;
    return this.httpClient.get<IYoutubeOembed>(`${baseUrl}/oembed?format=json&url=${encodeURIComponent(videoUrl)}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getOembedDataById(videoId: string): Observable<HttpResponse<IYoutubeOembed>> {
    // TODO: validate videoUrl ?
    const baseUrl = `https://www.youtube.com`;
    const baseParamUrl = `${baseUrl}/watch?v=${videoId}`;
    return this.httpClient.get<IYoutubeOembed>(`${baseUrl}/oembed?format=json&url=${encodeURIComponent(baseParamUrl)}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  fetchYoutubeVideoMeta(videoId: string): Observable<google.youtube.IVideoList> {

    const params = new HttpParams({
      fromObject: {
        key: environment.googleApiKey,
        id: videoId,
        part: 'snippet,contentDetails,player',
      }
    });

    return this.httpClient.get<google.youtube.IVideoList>(
      'https://www.googleapis.com/youtube/v3/videos',
      {observe: 'body', responseType: 'json', params}
    );
  }
}
