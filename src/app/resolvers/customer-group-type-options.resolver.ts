import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CustomerGroupService } from '@nusantara/services';
import { IChoice } from '@nusantara/models/drf';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupTypeOptionsResolver implements Resolve<IChoice[]> {

  constructor(private service: CustomerGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> {
    return this.service.getFieldChoices('type');
  }
}
