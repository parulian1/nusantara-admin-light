import { IOnBoarding } from '@nusantara/models';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OnboardingService } from '@nusantara/services';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentListResolver implements Resolve<PagedResponse<IOnBoarding>> {
  constructor(private service: OnboardingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IOnBoarding>> {
    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted'].indexOf(keyParam) >= 0) {
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
