import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { banner } from "@nusantara/models";

@Injectable({
  providedIn: 'root'
})
export class BannerService extends AbstractCrudService<banner.IBanner> {

  baseUrl = '/api/cms/banner';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
