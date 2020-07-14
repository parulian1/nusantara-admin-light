import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ReportingService } from '@nusantara/services';
import { IHrefEntity } from '@nusantara/models/base';


@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<IHrefEntity> {
  constructor(private service: ReportingService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IHrefEntity> {
    return this.service.getDashboard();
  }
}
