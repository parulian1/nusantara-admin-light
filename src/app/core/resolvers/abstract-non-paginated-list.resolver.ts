import { IHyperlinkedEntity } from '@nusantara/models/base';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PagedResponse } from '@nusantara/core/pagination';
import { AbstractCrudService } from '@nusantara/core/http';
import { Observable } from 'rxjs';

/**
 * Standard resolver for displaying on list pages.
 *
 * Supports pagination via the page=n query parameter.
 * Supports keyword filtering via the 'q=some+text' query parameter.
 */
export abstract class AbstractNonPaginatedListResolver<T extends IHyperlinkedEntity> implements Resolve<PagedResponse<T>> {

  protected readonly service: AbstractCrudService<T>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<T>> | Observable<never> {
    const query = route.queryParamMap.get('q');
    return this.service.fetchList(query, 1, this.service.maxPageSize);
  }
}
