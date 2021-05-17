import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IShowcase } from '@nusantara/models/marketplace';
import { MarketplaceShowcaseService } from '@nusantara/services/marketplace-showcase.service';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceShowcaseResolver implements Resolve<IShowcase> {
  constructor(private service: MarketplaceShowcaseService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Observable<never> {
    const shopSlug = route.paramMap.get("shop-slug");
    const showcaseId = route.paramMap.get("showcase-id");
    return this.service.fetch(shopSlug, +showcaseId);
  }
}
