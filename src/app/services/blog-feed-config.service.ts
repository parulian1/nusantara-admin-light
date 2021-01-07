import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IBlogFeedSetting} from '@nusantara/models/blog-feed-setting';
import {ErrorResult, IResultResponse, SuccessResult} from '@nusantara/core';
import {map} from 'rxjs/operators';
import {base} from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class BlogFeedConfigService {

  protected httpClient: HttpClient;
  protected baseUrl = '/api/cms/blog';

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  // retrieves a single object from the API based on it's slug
  fetchSettings(): Observable<IBlogFeedSetting> {
    const url = `${this.baseUrl}/settings/`;

    return this.httpClient
      .get<IBlogFeedSetting>(`${url}`, {observe: 'body', responseType: 'json'});
  }

  /**
   * Sends JSON or FormData to the URL described in entity.href using HTTP PATCH (NOT PUT).
   *
   * @param entity The form or JSON object to update
   * @param removeEmptyFiles Only used if entity is FormData;  Prevents unchanged file fields from being deleted.
   */
  update(entity: IBlogFeedSetting | FormData, removeEmptyFiles = true): Observable<IResultResponse> {

    return this.httpClient
      .patch<IBlogFeedSetting>(this.getEntityUrl(entity), entity, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => {
        if (resp.status === 200) {
          return new SuccessResult([], resp.body);
        }
        return new ErrorResult(resp.body, resp.status);
      }));
  }

  /**
   * Shortcut method; either creates or updates an object based on whether the .href
   * attribute is already set.  If not set, assumes that the object must be created.
   */
  save(entity: IBlogFeedSetting | FormData): Observable<IResultResponse> {
    return this.update(entity);
  }

  private getEntityUrl(entity: IBlogFeedSetting | base.IHrefEntity | FormData) {
    if (entity instanceof FormData) {
      return entity.get('href') as string;
    }
    return entity.href;
  }
}
