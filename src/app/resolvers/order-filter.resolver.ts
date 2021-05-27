import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { OrderService } from '@nusantara/services';
import { IOrderFilter } from '@nusantara/models/order/filter';

/**
 * Gets the valid "types" for product attributes.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderFilterResolver implements Resolve<IOrderFilter> {

  constructor(private service: OrderService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderFilter> | Observable<never> {
    return this.service.fetchOrderFilter();
  }
}
