import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AbstractDetailResolver } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';
import { ProductPromotionSingleService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ProductPromotionResolver extends AbstractDetailResolver<IProductPromotion> {
  constructor(service: ProductPromotionSingleService) { super(service); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductPromotion> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
