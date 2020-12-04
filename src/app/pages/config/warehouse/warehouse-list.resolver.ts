import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class WarehouseListResolver extends AbstractListResolver<IWarehouse> {
  constructor(service: WarehouseService) { super(service); }
}
