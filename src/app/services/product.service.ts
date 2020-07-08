import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

/**
 * Service for product CRUD.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends AbstractCrudService<products.IProduct> {

  baseUrl = '/api/catalog/product';

  constructor(protected httpClient: HttpClient) {
    super();
   }
}
