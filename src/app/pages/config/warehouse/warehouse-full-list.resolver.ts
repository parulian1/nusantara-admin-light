import { Injectable } from '@angular/core';

import { AbstractNonPaginatedListResolver } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';

/**
 * Returns the full list of available warehouses.
 */
@Injectable({
  providedIn: 'root'
})
export class WarehouseFullListResolver extends AbstractNonPaginatedListResolver<IWarehouse> {
  constructor(protected service: WarehouseService) { super(); }
}
