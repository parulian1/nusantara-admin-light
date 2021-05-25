import {AbstractCrudService} from '@nusantara/core';
import {IPoint} from '@nusantara/models/point';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserPointService extends AbstractCrudService<IPoint> {
  baseUrl = '/api/order/point';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchByUser(username: string): Observable<IPoint> {
    return this.httpClient.get<IPoint>(`/api/order/point/${username}/`,
      {observe: 'body', responseType: 'json'});
  }
}
