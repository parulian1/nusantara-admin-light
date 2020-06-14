import { Injectable } from '@angular/core';

import { CustomerGroupService } from '@nusantara/services';
import { ICustomerGroup } from '@nusantara/models';
import { AbstractDetailResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerGroupResolver extends AbstractDetailResolver<ICustomerGroup> {
  constructor(protected service: CustomerGroupService) { super(); }
}
