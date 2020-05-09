import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagedResponse } from '@nusantara/core/pagination';
import { IResultResponse, SuccessResult, ErrorResult } from '../responses';
import { IDrfOptionsResponse, IChoiceFieldChoice, IChoiceField } from '..';


export abstract class AbstractCrudService<T extends {href: string}> {

  protected httpClient: HttpClient;
  protected baseUrl: string;  // this would be best set from crawling the API root, but maybe later for that.

  // retrieves a single object from the API based on it's slug
  fetch(slug: string): Observable<T> {
    return this.httpClient
      .get<T>(`/${this.baseUrl}/${slug}/`, {observe: 'body', responseType: 'json'});
  }

  /**
   * Gets a paginated list of data from the API.
   *
   * @param query some text used to filter the results; optional.
   * @param page the page number to fetch from the API; default 1.
   */
  fetchList(query?: string, page: number = 1): Observable<PagedResponse<T>> {
    // create query params --> ?q=maybe&page=1
    const params = new HttpParams().append('page', page.toFixed(0).toString());
    if (query) {
      params.append('q', query);
    }

    return this.httpClient
      .get<T[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }

  create(entity: T): Observable<IResultResponse> {
    return this.httpClient
      .post(`${this.baseUrl}/`, entity, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 201 ? new SuccessResult() : new ErrorResult()));
  }

  update(entity: T): Observable<IResultResponse> {
    return this.httpClient
      .put<T>(entity.href, entity, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult()));
  }

  /**
   * Shortcut method; either creates or updates an object based on whether the .href
   * attribute is already set.  If not set, assumes that the object must be created.
   */
  save(entity: T): Observable<IResultResponse> {
    return (!!entity.href) ? this.update(entity) : this.create(entity);
  }

  delete(entity: T): Observable<IResultResponse> {
    return this.httpClient
      .delete(entity.href, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 204 ? new SuccessResult() : new ErrorResult()));
  }

  getFieldChoices(fieldName: string): Observable<IChoiceFieldChoice[]> {
    return this.httpClient
      .options<IDrfOptionsResponse>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json'})
      .pipe(map(resp => (resp.actions.POST[fieldName] as IChoiceField).choices));
  }

}
