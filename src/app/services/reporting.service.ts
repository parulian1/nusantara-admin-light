import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IHrefEntity } from '@nusantara/models/base';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  baseUrl = '/api/order/reporting';

  constructor(protected httpClient: HttpClient) { }

  getDashboard(): Observable<IHrefEntity> {
      return this.httpClient.get<IHrefEntity>(
        `${this.baseUrl}/dashboard/`,
        {observe: 'body', responseType: 'json'});
  }
}
