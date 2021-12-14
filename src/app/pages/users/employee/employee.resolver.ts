import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';

import {IEmployee} from '@nusantara/models';
import {EmployeeService, GroupService} from '@nusantara/services';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeResolver implements Resolve<IEmployee> {
  constructor(protected service: EmployeeService, protected groupService: GroupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployee> {
    const username = route.paramMap.get('username');
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted', 'include_inactive'].indexOf(keyParam) >= 0) {
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

    let page = params.get('page');
    if (!page) {
      page = '1';
    }
    let pagenum = 1;
    pagenum = parseInt(page, 10);
    if (pagenum < 1) {
      pagenum = 1;
    }


    return this.service.fetch(username).pipe(
      tap(employee => employee),
      switchMap(employee => {
        return this.groupService.fetchByEmail(pagenum, employee.email).pipe(
          map(groups => {
            return {...employee, groups};
          })
        );
      }),
      catchError(err => {
        throw new Error('Error: ' + err.message);
      })
    );
  }
}
