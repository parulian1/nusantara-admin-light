import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { ISla } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class SlaService extends AbstractCrudService<ISla> {

  baseUrl = '/api/cms/sla';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
