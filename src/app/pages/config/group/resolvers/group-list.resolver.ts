import { Injectable } from '@angular/core';

import { GroupService } from '@nusantara/services';
import { IAccessGroup } from '@nusantara/models';
import { AbstractListResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class GroupListResolver extends AbstractListResolver<IAccessGroup> {
  constructor(service: GroupService) { super(service); }

}
