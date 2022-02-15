import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ILowStock } from '@nusantara/models/products';
import { LowStockService } from '@nusantara/services/low-stock.service';

@Injectable({
  providedIn: 'root',
})
export class LowStockConfigResolver extends AbstractDetailResolver<ILowStock> {
  constructor(service: LowStockService) { super(service); }
}
