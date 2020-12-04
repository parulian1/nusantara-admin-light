import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PagedResponse, AbstractCrudService } from '@nusantara/core';
import { IHrefEntity } from '@nusantara/models/base';
import {HttpParams} from '@angular/common/http';

/**
 * Standard resolver for displaying on list pages.
 *
 * Supports pagination via the page=n query parameter.
 * Supports keyword filtering via the 'q=some+text' query parameter.
 */
export abstract class AbstractListResolver<T extends IHrefEntity> implements Resolve<PagedResponse<T>> {

  protected readonly service: AbstractCrudService<T>;

  protected constructor(service: AbstractCrudService<T>) {
    this.service = service;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<T>> | Observable<never> {
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
