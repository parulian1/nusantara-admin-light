import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ICustomerGroup } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupListResolver implements Resolve<PagedResponse<ICustomerGroup>> {

  constructor(private service: CustomerGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ICustomerGroup>> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
