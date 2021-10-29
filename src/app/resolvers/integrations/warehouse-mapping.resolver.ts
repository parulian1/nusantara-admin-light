import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {AbstractDetailResolver} from '@nusantara/core';
import {IWarehouseMapping} from '@nusantara/models/integrations/warehouse-mapping';
import {WarehouseMappingService} from '@nusantara/services/integrations/warehouse-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMappingResolver extends AbstractDetailResolver<IWarehouseMapping> {
  constructor(service: WarehouseMappingService) {
    super(service);
  }
}
