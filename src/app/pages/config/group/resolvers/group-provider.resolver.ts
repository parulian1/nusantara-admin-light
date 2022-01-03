import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IAccessGroup } from '@nusantara/models';
import { GroupService } from '@nusantara/services';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {GroupUserService} from '@nusantara/services/group-user.service';

@Injectable({
  providedIn: 'root',
})
export class GroupProviderResolver extends AbstractDetailResolver<IAccessGroup> {
  constructor(service: GroupService) { super(service); }
}
