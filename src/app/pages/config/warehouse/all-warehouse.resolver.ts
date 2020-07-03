import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class AllWarehouseResolver implements Resolve<IWarehouse[]> {

  constructor(private service: WarehouseService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWarehouse[]> {
    return this.service.fetchAll();
  }
}
