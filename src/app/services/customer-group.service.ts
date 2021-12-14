import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {AbstractCrudService, ErrorResult, IResultResponse, SuccessCreatedResult} from '@nusantara/core';
import {base, ICustomerGroup} from '@nusantara/models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends AbstractCrudService<ICustomerGroup> {

  baseUrl = '/api/iam/customer-group';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
  /**
   * Sends JSON or FormData to this service's list endpoint using HTTP POST.
   */
  assignUser(entity: ICustomerGroup, data: any, headers?: any): Observable<IResultResponse> {
    return this.httpClient
      .post(`${this.getEntityUrl(entity)}assign/`, data, {observe: 'response', responseType: 'json', headers})
      .pipe(map(resp => {
        if (resp.status === 201) {
          return new SuccessCreatedResult(resp.headers.get('Location'), [], resp.body);
        }
        return new ErrorResult(resp.body, resp.status);
      }));
  }

  revokeUser(entity: ICustomerGroup, data: any, headers?: any): Observable<IResultResponse> {
    return this.httpClient
      .post(`${this.getEntityUrl(entity)}revoke/`, data, {observe: 'response', responseType: 'json', headers})
      .pipe(map(resp => {
        if (resp.status === 201) {
          return new SuccessCreatedResult(resp.headers.get('Location'), [], resp.body);
        }
        return new ErrorResult(resp.body, resp.status);
      }));
  }


}
