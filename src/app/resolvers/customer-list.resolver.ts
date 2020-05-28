import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CustomerService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { ICustomer } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerListResolver implements Resolve<PagedResponse<ICustomer>> {

  constructor(private service: CustomerService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ICustomer>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
