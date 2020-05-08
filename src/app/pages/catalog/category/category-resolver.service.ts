import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ICategory, CategoryService } from './category.service';


/**
 * Finds a single category, based on it's slug in the route.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryResolverService implements Resolve<ICategory> {
  constructor(private service: CategoryService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategory> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug).pipe(
      take(1),
      mergeMap(entity => {
        if (entity) {
          return of(entity);
        } else {
          this.router.navigate(['/pages/categories/']);
          return EMPTY;
        }
      })
    );
  }
}
