import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IVendor } from '@nusantara/models';
import { VendorService } from '@nusantara/services';

/**
 * Fetches a non-paginated list of all vendor.
 */
@Injectable({
  providedIn: 'root',
})
export class AllVendorResolver implements Resolve<IVendor[]> {

  constructor(private service: VendorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVendor[]> {
    return this.service.fetchAll();
  }
}
