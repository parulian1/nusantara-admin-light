import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { EmployeeService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IEmployee } from '@nusantara/models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListResolver implements Resolve<PagedResponse<IEmployee>> {

  constructor(private service: EmployeeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IEmployee>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'use_pos', ].indexOf(keyParam) >= 0) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }

        params = params.set(keyParam, theQuery[keyParam]);
      }
    }
    return this.service.fetchParams(params);
  }
}
