import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AllEmployeeWarehouseResolver implements Resolve<IWarehouse[]> {

  constructor(private service: WarehouseService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWarehouse[]> {
    const params = new HttpParams({
      fromObject: { per_page: '250', include_deleted: 'true', include_inactive: 'true' }
    });
    return this.service.fetchParams(params).pipe(
      map(paginate => paginate.entities),
    );
  }
}
