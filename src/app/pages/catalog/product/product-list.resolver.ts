import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '@nusantara/services';
import { PagedResponse } from '@nusantara/core/pagination';
import { products } from '@nusantara/models';
import {HttpParams} from '@angular/common/http';

/**
 * Resolves a paginated list of products.
 *
 * @see PagedResponse
 */
@Injectable({
  providedIn: 'root'
})
export class ProductListResolver implements Resolve<PagedResponse<products.IProduct>> {

  constructor(private service: ProductService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<PagedResponse<products.IProduct>> | Observable<never> {
    // const query = route.queryParamMap.get('q');
    // const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    // return this.service.fetchParentList(query, page);
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted', ].indexOf(keyParam) >= 0) {
        if ('page' === keyParam || keyParam === 'per_page') {
          // need to validate number
          if (Number.isInteger(theQuery[keyParam])) {
            // TODO: probably need to throw error
            continue;
          }
        }

        params = params.set(keyParam, theQuery[keyParam]);
      }
    }

    return this.service.fetchParams(params);
  }
}
