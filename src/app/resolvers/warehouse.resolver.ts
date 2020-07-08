import { Injectable } from '@angular/core';

import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { AbstractDetailResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class WarehouseResolver extends AbstractDetailResolver<IWarehouse> {
  constructor(service: WarehouseService) { super(service); }
}
