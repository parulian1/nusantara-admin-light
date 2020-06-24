import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagedResponse } from '@nusantara/core/pagination';
import { IResultResponse, SuccessResult, ErrorResult, SuccessCreatedResult } from '../responses';
import { IDrfOptionsResponse, IChoiceFieldChoice, IChoiceField } from '..';

export abstract class AbstractCrudService<T extends {href: string}> {

  protected httpClient: HttpClient;
  protected baseUrl: string;  // this would be best set from crawling the API root, but maybe later for that.
  public readonly maxPageSize = 250;

  // retrieves a single object from the API based on it's slug
  fetch(slug: string): Observable<T> {
    return this.httpClient
      .get<T>(`${this.baseUrl}/${slug}/`, {observe: 'body', responseType: 'json'});
  }

  /**
   * Gets a paginated list of data from the API.
   *
   * @param query some text used to filter the results; optional.
   * @param page the page number to fetch from the API; default 1.
   * @param perPage the size of the page to be returned (API default = 50, max 250)
   */
  fetchList(query?: string, page: number = 1, perPage?: number): Observable<PagedResponse<T>> {
    // create query params --> ?q=maybe&page=1
    let params = new HttpParams().set('page', page.toFixed(0).toString());

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    return this.httpClient
      .get<T[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }

  /**
   * Sends JSON or FormData to this service's list endpoint using HTTP POST.
   */
  create(entity: T|FormData): Observable<IResultResponse> {
    return this.httpClient
      .post(`${this.baseUrl}/`, entity, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 201 ? new SuccessCreatedResult(resp.headers.get('Location')) : new ErrorResult()));
  }

  /**
   * Sends JSON or FormData to the URL described in entity.href using HTTP PATCH (NOT PUT).
   *
   * @param entity The form or JSON object to update
   * @param removeEmptyFiles Only used if entity is FormData;  Prevents unchanged file fields from being deleted.
   */
  update(entity: T|FormData, removeEmptyFiles = true): Observable<IResultResponse> {

    // prevent unchanged files from being deleted on form data.
    if (entity instanceof FormData && removeEmptyFiles) {
      this.removeEmptyFiles(entity);
    }

    return this.httpClient
      .patch<T>(this.getEntityUrl(entity), entity, {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult()));
  }

  /**
   * Removes 'File' objects from FormData, if they contain empty values.
   *
   * This is done so that files the user **does not** intend to delete are not removed
   * from this object.
   */
  protected removeEmptyFiles(formData: FormData): void {
    const keysToRemove = [];

    formData.forEach((value, key, parent) => {
      console.log(value, key, parent);
      if (value instanceof File) {
        if (!value.name) {
          keysToRemove.push(key);
        }
      }
    });

    for (const k of keysToRemove) {
      formData.delete(k);
    }
  }

  /**
   * Shortcut method; either creates or updates an object based on whether the .href
   * attribute is already set.  If not set, assumes that the object must be created.
   */
  save(entity: T|FormData): Observable<IResultResponse> {
    return (!!this.getEntityUrl(entity)) ? this.update(entity) : this.create(entity);
  }

  delete(entity: T|{href: string}|FormData): Observable<IResultResponse> {
    return this.httpClient
      .delete(this.getEntityUrl(entity), {observe: 'response', responseType: 'json'})
      .pipe(map(resp => resp.status === 204 ? new SuccessResult() : new ErrorResult()));
  }

  private getEntityUrl(entity: T|{href: string}|FormData) {
    if (entity instanceof FormData) {
      return entity.get('href') as string;
    }
    return entity.href;
  }

  /**
   * Fetches the options for a field;  This method does not support nested attributes.
   *
   * @example
   *  // Assuming this API has a field named "type" which can be "book", "ebook" or "subscription"
   *  [
   *    { href: "https://gra.media/1", "name": "Some Book" "type": "book" },
   *    { href: "https://gra.media/2", "name": "Some E-Book" "type": "ebook" }
   *  ]
   *
   *  // Then the following call would return you
   *  service.getFieldChoices('type').subscribe(next => console.log(next));
   *  [
   *    {value: "book", displayName: "Book"},
   *    {value: "ebook", displayName: "E-Book"},
   *    {value: "subscription", displayName: "Subscription"}
   *  ]
   *
   * @param fieldName A field with choices.  This field **must** be at the top level of the object(s).
   */
  getFieldChoices(fieldName: string): Observable<IChoiceFieldChoice[]> {
    return this.httpClient
      .options<IDrfOptionsResponse>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json'})
      .pipe(map(resp => (resp.actions.POST[fieldName] as IChoiceField).choices));
  }

}
