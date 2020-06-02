import { Injectable } from '@angular/core';

import { BaseDetailResolver } from '@nusantara/core';
import { IUser } from '@nusantara/models';
import { UserService } from '@nusantara/services';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver extends BaseDetailResolver<IUser> {
  constructor(protected service: UserService) { super(); }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
    const username = route.paramMap.get('username');
    return this.service.fetch(username);
  }
}
