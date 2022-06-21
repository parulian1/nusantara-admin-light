import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';
import { ProductPromotionSingleService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionSingleListResolver extends AbstractListResolver<IProductPromotion> {
  constructor(service: ProductPromotionSingleService) { super(service); }
}
