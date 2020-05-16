import { Injectable } from '@angular/core';

import { BaseDetailResolver } from '@nusantara/core';
import { IUser } from '@nusantara/models';
import { UserService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CustomerResolver extends BaseDetailResolver<IUser> {
  constructor(protected service: UserService) { super(); }
}
