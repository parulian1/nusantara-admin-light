import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import {IAccessGroup} from '@nusantara/models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends AbstractCrudService<IAccessGroup> {

  protected baseUrl = '/api/iam/access-group';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchByEmail(
    page: number = 1,
    userEmail?: string
  ): Observable<PagedResponse<IAccessGroup>> {
    const rawParams = {
      page: page.toFixed(0).toString(),
      email: userEmail,
    };

    return this.httpClient
      .get<IAccessGroup[]>(
        `${this.baseUrl}/`,
        {
          observe: 'response',
          responseType: 'json',
          params: new HttpParams({fromObject: rawParams})
        }
      ).pipe(map(resp => new PagedResponse(resp)));
  }

  addEmployee(accessGroupId: string, user: string): Observable<unknown> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json').set('Accept', 'application/json; version=3.0');

    return this.httpClient.post(
      `${this.baseUrl}/${accessGroupId}/user/`,
      {user},
      {
        observe: 'response', responseType: 'json', headers
      });
  }

  removeEmployee(accessGroupId: string, username: string): Observable<unknown> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json').set('Accept', 'application/json; version=3.0');

    return this.httpClient.delete(
      `${this.baseUrl}/${accessGroupId}/user/${username}/`,
      {
        observe: 'response', responseType: 'json',
        headers
      });
  }

  /**
   * Override fetch for versioning
   *
   * @param {string} slug
   * @returns {Observable<IAccessGroup>}
   */
  fetch(slug?: string): Observable<IAccessGroup> {
    let url = `${this.baseUrl}/`;
    if (!!slug) {
      url += `${slug}/`;
    }
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json').set('Accept', 'application/json; version=3.0');

    return this.httpClient
      .get<IAccessGroup>(`${url}`, {
        observe: 'body', responseType: 'json',
        headers,
      });
  }


  fetchParams(params: HttpParams): Observable<PagedResponse<IAccessGroup>> {
    let page = params.get('page');
    let perPage = params.get('per_page');
    if (!page) {
      page = '1';
    }

    if (!perPage) {
      perPage = '20';
    }

    params = params.set('page', page);
    params = params.set('per_page', perPage);

    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json').set('Accept', 'application/json; version=3.0');

    return this.httpClient
      .get<IAccessGroup[]>(
        `${this.baseUrl}/`,
        {
          observe: 'response',
          responseType: 'json',
          headers,
          params
        }
      ).pipe(map(resp => new PagedResponse(resp)));
  }
}
