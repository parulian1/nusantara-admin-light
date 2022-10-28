import {AbstractCrudService, PagedResponse} from '@nusantara/core';
import {IPoint, IPointSummary} from '@nusantara/models/point';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {IPointHistory} from "@nusantara/models/point-history";

@Injectable({
  providedIn: 'root'
})

export class UserPointService extends AbstractCrudService<IPoint> {
  baseUrl = '/api/order/point/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchHistory(username: string, page: number = 1, per_page: number = 10): Observable<PagedResponse<IPointHistory>> {
    let params = new HttpParams();
    params = params.set('username', username);
    params = params.set('ordering', '-id')
    params = params.set('page', page.toFixed(0).toString());
    params = params.set('per_page', per_page.toString());

    return this.httpClient.get<IPointHistory[]>(`/api/order/point-history/`,
      {observe: 'response', responseType: 'json', params}
      ).pipe(map(resp => new PagedResponse(resp)));
  }

  fetchByUser(username: string): Observable<IPointSummary> {
    return this.httpClient.get<IPointSummary>(`${this.baseUrl}?username=${username}`,
      {observe: 'body', responseType: 'json'}
      );
  }
}
