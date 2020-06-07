import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { IProductAttribute } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService extends AbstractCrudService<IProductAttribute> {
  baseUrl = '/api/catalog/product-attribute';
  constructor(protected httpClient: HttpClient) { super(); }
}

