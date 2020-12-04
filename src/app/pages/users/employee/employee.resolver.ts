import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IEmployee } from '@nusantara/models';
import { EmployeeService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class EmployeeResolver implements Resolve<IEmployee> {
  constructor(protected service: EmployeeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployee> {
    const username = route.paramMap.get('username');
    return this.service.fetch(username);
  }
}
