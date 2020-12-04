import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ThemeMediaService extends AbstractCrudService<products.IProductMedia> {

  baseUrl = '/api/client/theme-media';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}

