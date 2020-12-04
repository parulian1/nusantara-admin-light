import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IEmployee } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends AbstractCrudService<IEmployee> {

  protected baseUrl = '/api/iam/employee';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
