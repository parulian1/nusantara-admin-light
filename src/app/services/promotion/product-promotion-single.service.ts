import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import {IProductPromotion, IProductPromotionValidate} from '@nusantara/models';
import { Observable } from 'rxjs';
import {ErrorResult, IResultResponse, SuccessResult} from '@nusantara/core';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductPromotionSingleService extends AbstractCrudService<IProductPromotion> {

  baseUrl = '/api/catalog/product-promotion';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  get productListDownloadUrl(): string {
    // todo: fetch this from backend instead.
    return 'https://reports.bhisma.cloud/api/public/card/776647dc-2d6c-4955-a537-2108c176fa2b/query/xlsx?parameters=';
    // return 'https://reports.bhisma.cloud/public/question/776647dc-2d6c-4955-a537-2108c176fa2b';
  }

  fetch(slug?: string): Observable<IProductPromotion> {
    let url = `${this.baseUrl}/`;
    let params = new HttpParams();
    params = params.set('is_valid_product', 'false');
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<IProductPromotion>(`${url}`, {observe: 'body', responseType: 'json', params});
  }

  validate(entity: IProductPromotionValidate | FormData, headers?: any): Observable<any> {
    return this.httpClient
      .post<IProductPromotionValidate>(`${this.baseUrl}/validate/`, entity, {observe: 'response', responseType: 'json', headers});
  }

}
