import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IProductPromotion } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionService extends AbstractCrudService<IProductPromotion> {

  baseUrl = '/api/catalog/product-promotion';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  get productListDownloadUrl(): string {
    // todo: fetch this from backend instead.
    return 'https://reports.bhisma.cloud/api/public/card/776647dc-2d6c-4955-a537-2108c176fa2b/query/xlsx?parameters=';
    // return 'https://reports.bhisma.cloud/public/question/776647dc-2d6c-4955-a537-2108c176fa2b';
  }

}
