import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { ICustomer } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends AbstractCrudService<ICustomer> {

  protected baseUrl = 'api/iam/customer';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
