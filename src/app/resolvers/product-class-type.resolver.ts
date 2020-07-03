import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductClassService } from '@nusantara/services';
import { IChoice } from '@nusantara/models/drf';


/**
 * Gets the valid "types" for product classes.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductClassTypeResolver implements Resolve<IChoice[]> {

  constructor(private service: ProductClassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}

