import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { IReseller } from '@nusantara/models';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ResellerService extends AbstractCrudService<IReseller> {

  baseUrl = '/api/client/reseller-config';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
