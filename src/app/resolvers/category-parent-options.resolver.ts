import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CategoryParentOptionsResolver implements Resolve<ICategory[]> {

  constructor(private service: CategoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory[]> {
    return this.service.fetchAvailableParentCategories();
  }
}
