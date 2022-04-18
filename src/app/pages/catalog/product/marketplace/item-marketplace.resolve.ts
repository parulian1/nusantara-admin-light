import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { MarketplaceItemService, ProductService } from '@nusantara/services';
import { marketplace, products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ItemMarketplaceResolve implements Resolve<marketplace.IItemMarketplaceInfo> {

  constructor(private service: MarketplaceItemService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<marketplace.IItemMarketplaceInfo> {
    const id = route.paramMap.get('id');
    return this.service.getMarketplaceInfoDetail(id);
  }
}
