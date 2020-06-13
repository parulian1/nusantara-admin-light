import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { WarehouseService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IWarehouse } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class WarehouseListResolver implements Resolve<PagedResponse<IWarehouse>> {

  constructor(private service: WarehouseService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IWarehouse>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
