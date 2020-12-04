import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { products } from '@nusantara/models';
import { ProductOptionService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ProductOptionResolver implements Resolve<products.IProductOption> {
  constructor(private service: ProductOptionService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<products.IProductOption> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
