import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MarketplaceShopService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { marketplace } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceShopListResolver
  implements Resolve<PagedResponse<marketplace.IShop>> {
  constructor(
    private service: MarketplaceShopService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<PagedResponse<marketplace.IShop>> | Observable<never> {
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(page);
  }
}
