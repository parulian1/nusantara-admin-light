import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ThemeService } from '@nusantara/services';
import { IChoice } from '@nusantara/models/drf';

@Injectable({
  providedIn: 'root',
})
export class ThemeSubscriptionTypeOptionsResolver implements Resolve<IChoice[]> {

  constructor(private service: ThemeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> {
    return this.service.getFieldChoices('subscriptionType');
  }
}
