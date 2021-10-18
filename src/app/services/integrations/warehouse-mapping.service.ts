import { Injectable } from '@angular/core';
import {AbstractCrudService} from '@nusantara/core';
import {IWarehouseMapping} from '@nusantara/models/integrations/warehouse-mapping';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMappingService extends AbstractCrudService<IWarehouseMapping>{

  baseUrl = '/api/fulfillment/integration-mapping';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
