import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { VendorService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IVendor } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class VendorListResolver implements Resolve<PagedResponse<IVendor>> {

  constructor(private service: VendorService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IVendor>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
