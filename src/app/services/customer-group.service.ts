import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { ICustomerGroup } from '@nusantara/models';


@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends AbstractCrudService<ICustomerGroup> {

  baseUrl = '/api/iam/customer-group';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
