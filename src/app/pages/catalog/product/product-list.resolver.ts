import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductListResolver implements Resolve<PagedResponse<products.IProduct>> {

  constructor(private service: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<products.IProduct>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchParentList(query, page);
  }
}
