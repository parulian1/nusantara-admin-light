import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IAccessGroup } from '@nusantara/models';
import { GroupService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class GroupProviderResolver extends AbstractDetailResolver<IAccessGroup> {
  constructor(service: GroupService) { super(service); }
}
