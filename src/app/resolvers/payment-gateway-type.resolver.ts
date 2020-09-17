import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PaymentGatewayService } from '@nusantara/services';
import { IChoice } from '@nusantara/models/drf';


/**
 * Gets the valid "types" for payment gateway.
 */
@Injectable({
  providedIn: 'root',
})
export class PaymentGatewayTypeResolver implements Resolve<IChoice[]> {

  constructor(private service: PaymentGatewayService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}
