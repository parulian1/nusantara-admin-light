import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { products } from '@nusantara/models';
import { ProductOptionService } from '@nusantara/services';
@Injectable({
  providedIn: 'root'
})
export class ActiveProductOptionResolver implements Resolve<products.IProductOption[]> {
  constructor(private service: ProductOptionService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<products.IProductOption[]> {
    return this.service.fetchActiveProductOptions();
  }
}


