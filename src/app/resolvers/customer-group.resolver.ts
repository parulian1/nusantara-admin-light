import { Injectable } from '@angular/core';

import { CustomerGroupService } from '@nusantara/services';
import { ICustomerGroup } from '@nusantara/models';
import { BaseDetailResolver } from '@nusantara/core';


@Injectable({
  providedIn: 'root',
})
export class CustomerGroupResolver extends BaseDetailResolver<ICustomerGroup> {
  constructor(protected service: CustomerGroupService) { super(); }
}
