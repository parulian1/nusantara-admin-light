import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';
import { ProductPromotionService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionListResolver extends AbstractListResolver<IProductPromotion> {
  constructor(service: ProductPromotionService) { super(service); }
}
