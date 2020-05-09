import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IChoiceFieldChoice } from '@nusantara/core';
import { ProductAttributeService } from '@nusantara/services';

/**
 * Gets the valid "types" for product attributes.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductAttributeTypeResolver implements Resolve<IChoiceFieldChoice[]> {

  constructor(private service: ProductAttributeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoiceFieldChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}
