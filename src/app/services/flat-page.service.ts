import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { IFlatPage } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class FlatPageService extends AbstractCrudService<IFlatPage> {

  baseUrl = '/api/cms/page';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
