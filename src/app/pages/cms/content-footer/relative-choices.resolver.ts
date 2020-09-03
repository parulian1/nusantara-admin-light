import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IRelativeChoices } from '@nusantara/models';
import { ContentFooterService } from '@nusantara/services';

/**
 * Fetches a non-paginated list of all flatPage.
 */
@Injectable({
  providedIn: 'root',
})
export class RelativeChoicesResolver implements Resolve<IRelativeChoices[]> {

  constructor(private service: ContentFooterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRelativeChoices[]> {
    const slug = route.paramMap.get('slug') || '';
    return this.service.fetchRelativeChoices(slug);
  }
}
