import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PagedResponse } from '@nusantara/core';
import { ProductAttributeService } from '@nusantara/services';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeListResolver implements Resolve<PagedResponse<products.IProductAttribute>> {

  constructor(private service: ProductAttributeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<products.IProductAttribute>> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
