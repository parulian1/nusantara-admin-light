import { Injectable } from '@angular/core';
import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import {IAccessGroup, IUser} from '@nusantara/models';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupUserService extends AbstractCrudService<IUser> {

  protected baseUrl = '/api/iam/access-group';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public fetchParams(params: HttpParams): Observable<any> {
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

    const accessGroupId = params.get('access_group');
    if (!accessGroupId) {
      return of(EMPTY);
    }
    params = params.delete('access_group');

    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json').set('Accept', 'application/json; version=3.0');

    return this.httpClient
      .get<IUser[]>(
        `${this.baseUrl}/${accessGroupId}/user/`,
        {
          observe: 'response',
          responseType: 'json',
          headers,
          params
        }
      ).pipe(map(resp => new PagedResponse(resp)));

  }
}
