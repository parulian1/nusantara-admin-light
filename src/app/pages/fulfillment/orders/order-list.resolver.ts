import { Injectable } from '@angular/core';

import { IOrder } from '@nusantara/models';
import { OrderService } from '@nusantara/services';
import {AbstractListResolver, PagedResponse} from '@nusantara/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderListResolver extends AbstractListResolver<IOrder> {
  constructor(public service: OrderService) { super(service); }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IOrder>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (
        [
          'q',
          'ordering',
          'start_time',
          'end_time',
          'store_id',
          'order_status_admin',
          'shipping_method',
          'page',
          'per_page',
          'order',
          'is_testing',
        ].indexOf(keyParam) >= 0
      ) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }
        if (!!theQuery[keyParam]) {
          params = params.set(keyParam, theQuery[keyParam]);
        }
        continue;
      }
    }
    const query = route.queryParamMap.get('status');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);

    return this.service.fetchParams(params);
  }
}
