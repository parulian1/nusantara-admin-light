import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IPromoGroup } from '@nusantara/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionCampaignService extends AbstractCrudService<IPromoGroup> {

  baseUrl = '/api/catalog/promotion-group';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetch(slug?: string): Observable<IPromoGroup> {
    let url = `${this.baseUrl}/`;
    let params = new HttpParams();
    params = params.set('is_valid_product', 'false');
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<IPromoGroup>(`${url}`, {observe: 'body', responseType: 'json', params});
  }
}
