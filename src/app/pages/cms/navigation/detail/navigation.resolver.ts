import {Injectable} from '@angular/core';
import {AbstractDetailResolver} from '../../../../core/resolvers';
import {INavigation} from '../../../../models';
import {NavigationService} from '../../../../services/navigation.service';
import {HttpParams} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AbstractCrudService, PagedResponse} from '../../../../core';

@Injectable({
  providedIn: 'root'
})
export class NavigationResolver  implements Resolve<INavigation> {

  /**
   *
   * @type {NavigationService<INavigation>}
   * @protected
   */
  protected readonly service: NavigationService;

  constructor(service: NavigationService) {
    this.service = service;
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<INavigation> | Observable<never> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    const slug = route.paramMap.get('slug');
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
    return this.service.fetchDetailWithParam(slug, params);
  }
}
