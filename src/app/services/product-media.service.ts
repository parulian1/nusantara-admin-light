import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { IProductMedia } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductMediaService extends AbstractCrudService<IProductMedia> {
  baseUrl = '/api/catalog/product-media';
  constructor(protected httpClient: HttpClient) { super(); }
}

