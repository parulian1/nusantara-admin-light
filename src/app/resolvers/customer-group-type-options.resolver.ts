import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CustomerGroupService } from '@nusantara/services';
import { IChoiceFieldChoice } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupTypeOptionsResolver implements Resolve<IChoiceFieldChoice[]> {

  constructor(private service: CustomerGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoiceFieldChoice[]> {
    return this.service.getFieldChoices('type');
  }
}
