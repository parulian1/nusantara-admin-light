import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { ProductClassService } from '@nusantara/pages/catalog/product-class/product-class.service';
import { IChoiceFieldChoice } from '@nusantara/core';


/**
 * Gets the valid "types" for product classes.
 */
@Injectable({
  providedIn: 'root',
})
export class ProductClassChoiceResolver implements Resolve<IChoiceFieldChoice[]> {

  constructor(private service: ProductClassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoiceFieldChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}

