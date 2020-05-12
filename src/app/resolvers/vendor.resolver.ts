import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IVendor } from '@nusantara/models';
import { VendorService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class VendorResolver implements Resolve<IVendor> {
  constructor(private service: VendorService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVendor> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
