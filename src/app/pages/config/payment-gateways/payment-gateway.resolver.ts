import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { PaymentGatewayService } from '../../../services';
import { IPaymentGateway } from '../../../models';


@Injectable({
  providedIn: 'root',
})
export class PaymentGatewayResolver implements Resolve<IPaymentGateway> {

  constructor(private service: PaymentGatewayService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPaymentGateway> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug).pipe(
      take(1),
      mergeMap(entity => {
        if (entity) {
          return of(entity);
        } else {
          this.router.navigate(['/pages/payment-gateways/']);
          return EMPTY;
        }
      })
    );
  }
}
