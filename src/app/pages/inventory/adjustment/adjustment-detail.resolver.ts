import { IAdjustment } from '@nusantara/models/inventory';
import { AbstractDetailResolver } from '@nusantara/core';
import { InventoryAdjustmentOrderService } from '@nusantara/services';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AdjustmentDetailResolver extends AbstractDetailResolver<IAdjustment> {
  constructor(service: InventoryAdjustmentOrderService) { super(service); }
}
