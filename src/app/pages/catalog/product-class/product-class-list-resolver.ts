import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IProductClass, ProductClassService } from './product-class.service';
import { PagedResponse } from '@nusantara/core/pagination';


@Injectable({
  providedIn: 'root',
})
export class ProductClassListResolver implements Resolve<PagedResponse<IProductClass>> {

  constructor(private service: ProductClassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IProductClass>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
