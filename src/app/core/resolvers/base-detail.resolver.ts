import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core/http';
import { INamedHrefEntity } from '@nusantara/models/base';

/**
 * Base class for single entity resolvers.  It assumes that a single URL parameter (slug)
 * will be passed in the route.
 */
export abstract class BaseDetailResolver<T extends INamedHrefEntity> implements Resolve<T> {

  protected service: AbstractCrudService<T>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
