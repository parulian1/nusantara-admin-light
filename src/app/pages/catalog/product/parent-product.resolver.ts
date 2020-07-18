import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '@nusantara/services';
import { IProduct } from '@nusantara/models/products';

@Injectable({
  providedIn: 'root'
})
export class ParentProductResolver implements Resolve<IProduct> {

  constructor(private service: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    const slug = route.paramMap.get('parent-slug');
    return this.service.fetch(slug);
  }
}
