import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ICustomerGroup } from '@nusantara/models';
import { AbstractCrudService } from '@nusantara/core/http';


@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends AbstractCrudService<ICustomerGroup> {

  baseUrl = '/api/iam/customer-group';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
