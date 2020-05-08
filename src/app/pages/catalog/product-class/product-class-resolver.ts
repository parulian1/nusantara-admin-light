import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { IProductClass, ProductClassService } from './product-class.service';


@Injectable({
  providedIn: 'root',
})
export class ProductClassResolver implements Resolve<IProductClass> {

  constructor(private service: ProductClassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductClass> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug).pipe(
      take(1),
      mergeMap(entity => {
        if (entity) {
          return of(entity);
        } else {
          this.router.navigate(['/pages/product-classes/']);
          return EMPTY;
        }
      })
    );
  }
}
