import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ICustomerGroup } from '@nusantara/models';
import { CustomerGroupService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupResolver extends AbstractDetailResolver<ICustomerGroup> {
  constructor(service: CustomerGroupService) { super(service); }
}
