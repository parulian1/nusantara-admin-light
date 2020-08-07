import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IProductPromotion } from '@nusantara/models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionService extends AbstractCrudService<IProductPromotion> {

  baseUrl = '/api/catalog/product-promotion';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
