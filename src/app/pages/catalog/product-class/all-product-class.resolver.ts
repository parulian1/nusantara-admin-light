import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IProductClass } from '@nusantara/models';
import { ProductClassService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class AllProductClassResolver implements Resolve<IProductClass[]> {

  constructor(private service: ProductClassService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductClass[]> {
    return this.service.fetchAll();
  }
}
