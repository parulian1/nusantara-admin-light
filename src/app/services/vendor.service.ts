import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { IVendor } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends AbstractCrudService<IVendor> {

  baseUrl = '/api/catalog/vendor';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
