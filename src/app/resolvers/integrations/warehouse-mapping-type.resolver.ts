import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {IChoice} from '@nusantara/models/drf';
// import {WarehouseMappingTypeService} from '@nusantara/services/integrations/warehouse-mapping-type.service';
import {WarehouseMappingService} from '@nusantara/services/integrations/warehouse-mapping.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseMappingTypeResolver implements Resolve<IChoice[]> {

  constructor(private service: WarehouseMappingService, private router: Router) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> {
    return this.service.getFieldChoices('type');
  }
}
