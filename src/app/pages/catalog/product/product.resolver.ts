import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '@nusantara/services';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<products.IProduct> {

  constructor(private service: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<products.IProduct> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
