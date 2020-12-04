import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';
import { ProductPromotionService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ProductPromotionResolver extends AbstractDetailResolver<IProductPromotion> {
  constructor(service: ProductPromotionService) { super(service); }
}
