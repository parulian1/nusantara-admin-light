import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import { IOrder } from '@nusantara/models';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractCrudService<IOrder> {

  protected baseUrl = '/api/order/order';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public fetchParams(params: HttpParams) {
    let page = params.get('page');
    let per_page = params.get('per_page');
    if (!page) {
      page = '1';
    }

    if (!per_page) {
      per_page = '20';
    }

    params = params.set('page', page);
    params = params.set('per_page', per_page);

    return this.httpClient
      .get<IOrder[]>(
        `${this.baseUrl}/`,
        {
          observe: 'response',
          responseType: 'json',
          params
        }
      ).pipe(map(resp => new PagedResponse(resp)));
  }

  fetchWithParam(
    page: number = 1,
    user_email?: string
  ): Observable<PagedResponse<IOrder>> {
    const rawParams = {
      'page': page.toFixed(0).toString(),
      'user': user_email,
    };

    return this.httpClient
      .get<IOrder[]>(
        `${this.baseUrl}/`,
        {
          observe: 'response',
          responseType: 'json',
          params: new HttpParams({fromObject: rawParams})
        }
      ).pipe(map(resp => new PagedResponse(resp)));
  }

  updateByOrderNumber(orderNumber: string, data: any = {}): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${orderNumber}/`, data);
  }
}
