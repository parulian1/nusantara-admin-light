import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { ISubLocation } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class SubLocationService extends AbstractCrudService<ISubLocation> {

  baseUrl = '/api/fulfillment/sub-location';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
