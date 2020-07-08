import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core';
import { IHrefEntity } from '@nusantara/models/base';

/**
 * Standard resolver for detail pages (eg, any page where the user is editing an
 * existing entity).
 *
 * This resolver assumes there will be a single url parameter named /:slug which can be used
 * to fetch the desired object.
 */
export abstract class AbstractDetailResolver<T extends IHrefEntity> implements Resolve<T> {

  protected readonly service: AbstractCrudService<T>;

  protected constructor(service: AbstractCrudService<T>) {
    this.service = service;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Observable<never> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
