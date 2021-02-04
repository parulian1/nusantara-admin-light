import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import {IAccessGroup, IOrder} from '@nusantara/models';
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
      'page': page.toFixed(0).toString(),
      'email': userEmail,
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
    return this.httpClient.post(`${this.baseUrl}/${accessGroupId}/user/`, { user });
  }

  removeEmployee(accessGroupId: string, username: string): Observable<unknown> {
    return this.httpClient.delete(`${this.baseUrl}/${accessGroupId}/user/${username}/`);
  }
}
