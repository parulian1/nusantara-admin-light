import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ICustomer } from '@nusantara/models';
import { CustomerService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver implements Resolve<ICustomer> {
  constructor(protected service: CustomerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICustomer> {
    const username = route.paramMap.get('username');
    return this.service.fetch(username);
  }
}
