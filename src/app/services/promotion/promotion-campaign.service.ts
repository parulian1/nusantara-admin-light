import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IPromoGroup } from '@nusantara/models';
import { Observable } from 'rxjs';
import { PagedResponse } from '@nusantara/core';
import { map } from 'rxjs/operators';

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
    console.log('slug', slug, !!slug);
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<IPromoGroup>(`${url}`, {observe: 'body', responseType: 'json', params});
  }

  fetchListWithInactive(
    query?: string, page: number = 1, perPage?: number, otherParams?: any
  ): Observable<PagedResponse<IPromoGroup>> {
    let params = new HttpParams().set('page', page.toFixed(0).toString());

    if (perPage) {
      params = params.set('per_page', perPage.toFixed(0).toString());
    }

    if (query) {
      params = params.set('q', query);
    }

    params = params.set('include_inactive', 'true');

    return this.httpClient
      .get<IPromoGroup[]>(`${this.baseUrl}/`, {observe: 'response', responseType: 'json', params})
      .pipe(map(resp => new PagedResponse(resp)));
  }
}
