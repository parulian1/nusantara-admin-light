import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { products } from '@nusantara/models';
import { ProductClassService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class AllProductClassResolver implements Resolve<products.IProductClass[]> {

  constructor(private service: ProductClassService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<products.IProductClass[]> {
    return this.service.fetchAll();
  }
}
