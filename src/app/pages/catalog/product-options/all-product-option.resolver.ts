import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PagedResponse } from '@nusantara/core/pagination';
import { products } from '@nusantara/models';
import { ProductOptionService } from '@nusantara/services';
@Injectable({
  providedIn: 'root'
})
export class AllProductOptionResolver implements Resolve<PagedResponse<products.IProductOption>> {
  constructor(private service: ProductOptionService) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<PagedResponse<products.IProductOption>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}


