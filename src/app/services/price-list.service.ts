import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { IPriceList } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PriceListService extends AbstractCrudService<IPriceList> {

  baseUrl = '/api/catalog/price-list';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
