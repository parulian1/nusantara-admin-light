import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService extends AbstractCrudService<products.IProductAttribute> {

  baseUrl = '/api/catalog/product-attribute';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
