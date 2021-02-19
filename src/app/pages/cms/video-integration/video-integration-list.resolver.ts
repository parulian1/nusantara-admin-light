import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { IVideoIntegrationItem } from '@nusantara/models/video-integration';
import { VideoIntegrationService } from '@nusantara/services/video-integration.service';
import { AbstractListResolver, getSlugFromHref, PagedResponse } from '@nusantara/core';


@Injectable({ providedIn: 'root'})
export class VideoIntegrationListResolver extends AbstractListResolver<IVideoIntegrationItem> {
  filtersSupported = ['q', 'page', 'per_page', 'include_deleted', 'include_inactive', 'content_group'];

  constructor(service: VideoIntegrationService, private service1: VideoIntegrationService) {
    super(service);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<IVideoIntegrationItem>> | Observable<never> {
    return this.service1.fetchFirstGroup().pipe(
      mergeMap(groupHref => {
        return this.fetch(route, { content_group: getSlugFromHref(groupHref) });
      }),
      catchError(e => {
        return of([]);
      })
    );
  }

  fetch(route: ActivatedRouteSnapshot, extraParams?: any): Observable<any> {
    let params = new HttpParams();
    let theQuery = route.queryParams;

    if (extraParams) {
      theQuery = {...theQuery, ...extraParams};
    }

    for (const keyParam of Object.keys(theQuery)) {
      if (this.filtersSupported.indexOf(keyParam) >= 0) {
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
