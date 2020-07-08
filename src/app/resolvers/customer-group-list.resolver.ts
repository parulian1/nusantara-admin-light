import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { ICustomerGroup } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupListResolver extends AbstractListResolver<ICustomerGroup> {
  constructor(service: CustomerGroupService) { super(service); }
}
