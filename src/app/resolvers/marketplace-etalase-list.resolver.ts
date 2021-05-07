import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { marketplace } from "@nusantara/models";
import { MarketplaceEtalaseService } from "@nusantara/services/marketplace-showcase.service";

@Injectable({
  providedIn: "root",
})
export class MarketplaceEtalaseListResolver
  implements Resolve<marketplace.IEtalase[]> {
  constructor(private service: MarketplaceEtalaseService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<marketplace.IEtalase[]> | Observable<never> {
    const shopSlug = route.paramMap.get("shop-slug");
    return this.service.fetchList(shopSlug);
  }
}
