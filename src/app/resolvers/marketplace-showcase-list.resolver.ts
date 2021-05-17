import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { marketplace } from "@nusantara/models";
import { MarketplaceShowcaseService } from "@nusantara/services/marketplace-showcase.service";
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class MarketplaceShowcaseListResolver {
  constructor(private service: MarketplaceShowcaseService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<marketplace.IShowcase[]> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    const shopSlug = route.paramMap.get("shop-slug");
    for (const keyParam of Object.keys(theQuery)) {
      if (['q'].indexOf(keyParam) >= 0) {
        params = params.set(keyParam, theQuery[keyParam]);
      }
    }
    return this.service.fetchParams(shopSlug, params);
  }

}
