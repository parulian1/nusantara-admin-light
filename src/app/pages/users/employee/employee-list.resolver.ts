import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { EmployeeService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IEmployee } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListResolver implements Resolve<PagedResponse<IEmployee>> {

  constructor(private service: EmployeeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IEmployee>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
