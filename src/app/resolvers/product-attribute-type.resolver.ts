import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IChoice } from '@nusantara/models/drf';
import { ProductAttributeService } from '@nusantara/services';

/**
 * Gets the valid "types" for product attributes.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductAttributeTypeResolver implements Resolve<IChoice[]> {

  constructor(private service: ProductAttributeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}
