import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IWarehouse } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends AbstractCrudService<IWarehouse> {

  baseUrl = '/api/catalog/warehouse';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
