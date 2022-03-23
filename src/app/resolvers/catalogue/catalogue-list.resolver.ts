import { Injectable } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import {AbstractListResolver, PagedResponse} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {CatalogueService} from '@nusantara/services/catalogue.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogueListResolver extends AbstractListResolver<ICatalogue> {
  constructor(service: CatalogueService) {
    super(service);
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ICatalogue>> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_inactive', ].indexOf(keyParam) >= 0) {
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
