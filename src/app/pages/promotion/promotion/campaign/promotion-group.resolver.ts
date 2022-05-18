import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AbstractDetailResolver } from '@nusantara/core';
import { IPromoGroup } from '@nusantara/models';
import { PromotionCampaignService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class PromotionGroupResolver extends AbstractDetailResolver<IPromoGroup> {
  constructor(service: PromotionCampaignService) { super(service); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPromoGroup> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
