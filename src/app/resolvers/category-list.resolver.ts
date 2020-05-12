import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';

@Injectable({
  providedIn: 'root',
})
export class CategoryListResolver implements Resolve<PagedResponse<ICategory>> {

  constructor(private service: CategoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ICategory>> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
