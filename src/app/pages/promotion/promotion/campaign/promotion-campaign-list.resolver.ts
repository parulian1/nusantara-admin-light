import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IPromoGroup } from '@nusantara/models';
import { PromotionCampaignService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class PromotionCampaignListResolver extends AbstractListResolver<IPromoGroup> {
  constructor(service: PromotionCampaignService) { super(service); }
}
