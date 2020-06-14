import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { PagedResponse } from '@nusantara/core/pagination';
import { AbstractCrudService } from '@nusantara/core/http';
import { IHyperlinkedEntity } from '@nusantara/models/base';

/**
 * Standard resolver for displaying on list pages.
 *
 * Supports pagination via the page=n query parameter.
 * Supports keyword filtering via the 'q=some+text' query parameter.
 */
export abstract class AbstractListResolver<T extends IHyperlinkedEntity> implements Resolve<PagedResponse<T>> {

  protected readonly service: AbstractCrudService<T>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<T>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    const page = parseInt(route.queryParamMap.get('page') || '1', 10);
    return this.service.fetchList(query, page);
  }
}
