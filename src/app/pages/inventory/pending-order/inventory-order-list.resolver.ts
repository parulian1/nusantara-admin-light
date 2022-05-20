import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AbstractListResolver, PagedResponse } from '@nusantara/core';
import { IInventoryOrderSummary } from '@nusantara/models/inventory';
import { InventoryOrderService } from '@nusantara/services';

import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryOrderListResolver extends AbstractListResolver<IInventoryOrderSummary> {
  constructor(service: InventoryOrderService) { super(service); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IInventoryOrderSummary>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (
        [
          'start_date',
          'end_date',
          'receiving_status',
          'receiving_type',
          'page',
          'per_page',
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
