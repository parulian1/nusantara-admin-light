import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, } from 'rxjs';

import { IEntityHref } from '@nusantara/core';
import { CategoryService } from './category.service';

/**
 * Finds all the possible parent categories, and returns in a flattened
 * list of their name and href.
 */
@Injectable({
  providedIn: 'root',
})
export class ParentCategoriesResolver implements Resolve<IEntityHref[]> {
  constructor(private service: CategoryService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEntityHref[]> {
    return of([
      {name: 'Books', href: 'https://bhisma.cloud/api/catalog/categories/books/'},
      {name: 'Books > Fiction', href: 'https://bhisma.cloud/api/catalog/categories/books/fiction/'},
      {name: 'Books > Reference', href: 'https://bhisma.cloud/api/catalog/categories/books/reference/'},
      {name: 'Cosmetics', href: 'https://bhisma.cloud/api/catalog/categories/costmetics/'}
    ]);

  }
}
