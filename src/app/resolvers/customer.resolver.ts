import { Injectable } from '@angular/core';

import { BaseDetailResolver } from '@nusantara/core';
import { ICustomer } from '@nusantara/models';
import { CustomerService } from '@nusantara/services';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver extends BaseDetailResolver<ICustomer> {
  constructor(protected service: CustomerService) { super(); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICustomer> {
    const username = route.paramMap.get('username');
    return this.service.fetch(username);
  }
}
