import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MarketplaceProductClassService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IShop } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceProductClassListResolver
  implements Resolve<PagedResponse<IShop>> {
  constructor(private service: MarketplaceProductClassService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<PagedResponse<IShop>> | Observable<never> {
    const shopSlug = route.paramMap.get('shop-slug');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(shopSlug, page);
  }
}
