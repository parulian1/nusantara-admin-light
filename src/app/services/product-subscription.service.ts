import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductSubscriptionService extends AbstractCrudService<products.IProductSubscription> {

  baseUrl = '/api/catalog/product-subscription';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
