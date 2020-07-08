import { Injectable } from '@angular/core';

import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { AbstractListResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class WarehouseListResolver extends AbstractListResolver<IWarehouse> {
  constructor(service: WarehouseService) { super(service); }
}
