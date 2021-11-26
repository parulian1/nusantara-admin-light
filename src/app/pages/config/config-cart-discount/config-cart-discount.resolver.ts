import { AbstractDetailResolver } from '@nusantara/core';
import { IConfigCartDiscount } from '@nusantara/models/config-cart-discount';
import { ConfigCartDiscountService } from '@nusantara/services/config-cart-discount.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigCartDiscountResolver extends AbstractDetailResolver<IConfigCartDiscount> {
  constructor(service: ConfigCartDiscountService) { super(service); }
}
