import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import {ICompanyStory, IWarehouse} from '@nusantara/models';
import {CompanyStoryService, WarehouseService} from '@nusantara/services';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AllCompanyStoryResolver implements Resolve<ICompanyStory[]> {

  constructor(private service: CompanyStoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICompanyStory[]> {
    const params = new HttpParams({
      fromObject: { per_page: '250', include_deleted: 'true' }
    });
    return this.service.fetchParams(params).pipe(
      map(paginate => paginate.entities),
    );
  }
}
