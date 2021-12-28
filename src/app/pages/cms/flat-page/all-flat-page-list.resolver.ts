import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IFlatPage } from '@nusantara/models';
import { FlatPageService } from '@nusantara/services';

/**
 * Fetches a non-paginated list of all flatPage.
 */
@Injectable({
  providedIn: 'root',
})
export class AllFlatPageListResolver implements Resolve<IFlatPage[]> {

  constructor(private service: FlatPageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFlatPage[]> {
    return this.service.fetchAll();
  }
}
