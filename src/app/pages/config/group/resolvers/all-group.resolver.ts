import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { IAccessGroup } from '@nusantara/models';
import { GroupService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class AllGroupResolver implements Resolve<IAccessGroup[]> {
  constructor(private service: GroupService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAccessGroup[]> {
    return this.service.fetchAll();
  }
}
