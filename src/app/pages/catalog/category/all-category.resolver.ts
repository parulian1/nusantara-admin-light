import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';

/**
 * Fetches a non-paginated list of all categories.
 */
@Injectable({
  providedIn: 'root',
})
export class AllCategoryResolver implements Resolve<ICategory[]> {

  constructor(private service: CategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory[]> {
    return this.service.fetchAll();
  }
}
