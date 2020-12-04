import {Injectable} from '@angular/core';
import {AbstractListResolver, PagedResponse} from '@nusantara/core';
import {INavigation} from '@nusantara/models';
import {NavigationService} from '@nusantara/services/navigation.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NavigationListResolver extends AbstractListResolver<INavigation> {
  constructor(service: NavigationService) {
    super(service);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<INavigation>> | Observable<never> {
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
    params = params.set('include_deleted', 'true');

    return this.service.fetchParams(params);
  }
}
