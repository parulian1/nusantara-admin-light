import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IContentType } from '@nusantara/models/base';


@Injectable({
  providedIn: 'root'
})
export class CmsContentTypesService extends AbstractCrudService<IContentType> {

  protected baseUrl = '/api/cms/content-type';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
