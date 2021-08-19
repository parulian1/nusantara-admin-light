import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import {PaymentGatewayService} from '@nusantara/services';
import {IChoice} from '@nusantara/models/drf';
import {withLatestFrom} from 'rxjs/operators';


/**
 * Gets the valid "types" for payment gateway.
 */
@Injectable({
  providedIn: 'root',
})
export class PaymentGatewayTypeAndExpiryChoiceResolver implements Resolve<[IChoice[], IChoice[]]> {

  constructor(private service: PaymentGatewayService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[IChoice[], IChoice[]]> |
    Observable<[never, never]> {
    return this.service.getFieldChoices('type').pipe(
      withLatestFrom(this.service.getFieldChoices('expiryReminder'))
    );
  }
}
