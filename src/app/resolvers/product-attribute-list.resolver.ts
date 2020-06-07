import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PagedResponse } from '@nusantara/core/pagination';
import { ProductAttributeService } from '@nusantara/services';
import { IProductAttribute } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeListResolver implements Resolve<PagedResponse<IProductAttribute>> {

  constructor(private service: ProductAttributeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IProductAttribute>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
