import { Injectable } from '@angular/core';
import { IUser} from '@nusantara/models';
import {AbstractListResolver, PagedResponse} from '@nusantara/core';
import {GroupUserService} from '@nusantara/services/group-user.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupUserListResolver extends AbstractListResolver<IUser> {
  constructor(service: GroupUserService) { super(service); }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IUser>> | Observable<any> {

    let params = new HttpParams();
    const theQuery = route.queryParams;
    for (const keyParam of Object.keys(theQuery)) {
      if (['q', 'page', 'per_page', 'include_deleted', 'include_inactive'].indexOf(keyParam) >= 0) {
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
    const slug = route.paramMap.get('slug');
    params = params.set('access_group', slug);

    return this.service.fetchParams(params).pipe(catchError(err => {
      return of(EMPTY);
    }));
  }
}
