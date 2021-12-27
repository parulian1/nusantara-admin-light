import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AdvancedPriceListService } from '@nusantara/services';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';

@Injectable({
  providedIn: 'root',
})
export class AdvancedPriceResolver implements Resolve<IAdvancedPriceList> {
  constructor(private service: AdvancedPriceListService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAdvancedPriceList> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
