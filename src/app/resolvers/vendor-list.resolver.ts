import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { VendorService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { IVendor } from '@nusantara/models';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorListResolver implements Resolve<PagedResponse<IVendor>> {

  constructor(private service: VendorService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IVendor>> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted', ].indexOf(keyParam) >= 0) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }

        params = params.set(keyParam, theQuery[keyParam]);
      }
    }
    return this.service.fetchParams(params);
  }
}
