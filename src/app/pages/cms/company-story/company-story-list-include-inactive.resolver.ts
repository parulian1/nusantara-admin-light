import { Injectable } from '@angular/core';

import {AbstractListResolver, PagedResponse} from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import { CompanyStoryService } from '@nusantara/services';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyStoryListIncludeInactiveResolver extends AbstractListResolver<ICompanyStory> {
  constructor(service: CompanyStoryService) { super(service); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PagedResponse<ICompanyStory>> {
    const params = new HttpParams({
      fromObject: { per_page: '250', include_deleted: 'true' }
    });
    return this.service.fetchParams(params);
  }
}
