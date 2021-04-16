import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MarketplaceShopService } from '@nusantara/services';
import { marketplace } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceLogisticListResolver
  implements Resolve<marketplace.ILogistic[]> {
  constructor(
    private service: MarketplaceShopService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<marketplace.ILogistic[]> | Observable<never> {
    const shopSlug = route.paramMap.get('shop-slug');
    return this.service.fetchLogistic(shopSlug);
  }
}
