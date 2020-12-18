import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { ISiteConfig } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class SiteConfigService extends AbstractCrudService<ISiteConfig> {

  baseUrl = '/api/client/site-config';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

}
