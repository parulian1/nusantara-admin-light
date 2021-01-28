import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import { IReceivingOrder, IReceivingOrderDetail } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceReceivingOrderService {
  baseUrl = '/api/marketplace/receiving-order';

  constructor(private httpClient: HttpClient) {}

  fetchList(
    page: number = 1,
    isPublishedOnly?: boolean
  ): Observable<PagedResponse<IReceivingOrder>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());

    if (isPublishedOnly) {
      params = params.set('is_published_only', 'true');
    } else {
      params = params.set('is_processed_only', 'true');
    }
  
    return this.httpClient
      .get<IReceivingOrder[]>(`${this.baseUrl}/`, {
        observe: 'response',
        responseType: 'json',
        params,
      })
      .pipe(map((resp) => new PagedResponse(resp)));
  }
}
