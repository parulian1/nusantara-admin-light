import { Injectable } from '@angular/core';
import {IWarehouseMapping} from '@nusantara/models/integrations/warehouse-mapping';
import {WarehouseMappingService} from '@nusantara/services/integrations/warehouse-mapping.service';
import {AbstractListResolver} from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMappingListResolver extends AbstractListResolver<IWarehouseMapping> {
  constructor(service: WarehouseMappingService) {
    super(service);
  }
}
