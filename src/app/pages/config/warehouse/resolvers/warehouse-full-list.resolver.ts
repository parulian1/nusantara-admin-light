import { Injectable } from '@angular/core';

import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { AbstractNonPaginatedListResolver } from '@nusantara/core/resolvers';

/**
 * Returns the full list of available warehouses.
 */
@Injectable({
  providedIn: 'root'
})
export class WarehouseFullListResolver extends AbstractNonPaginatedListResolver<IWarehouse> {
  constructor(protected service: WarehouseService) { super(); }
}
