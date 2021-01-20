import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MarketplaceShopService } from '@nusantara/services';
import { ILogistic, IShop } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceLogisticListResolver
  implements Resolve<ILogistic[]> {
  constructor(
    private service: MarketplaceShopService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ILogistic[]> | Observable<never> {
    const shopSlug = route.paramMap.get('shop-slug');
    return this.service.fetchLogistic(shopSlug);
  }
}
