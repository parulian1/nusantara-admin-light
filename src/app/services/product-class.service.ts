import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IChoiceField, IChoiceFieldChoice, IDrfOptionsResponse } from '@nusantara/core';
import { PagedResponse } from '@nusantara/core/pagination';
import { ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core/responses';

import { IProductClass } from '@nusantara/models';


@Injectable({
  providedIn: 'root'
})
export class ProductClassService {

  constructor(private httpClient: HttpClient) { }

  fetch(slug: string): Observable<IProductClass> {
    return this.httpClient.get<IProductClass>(
      `/api/catalog/product-class/${slug}/`,
      {observe: 'body', responseType: 'json'}
    );
  }

  fetchList(query?: string, page: number = 1): Observable<PagedResponse<IProductClass>> {
    const params = new HttpParams()
      .append('page', page.toFixed(0).toString());
    if (query) {
      params.append('q', query);
    }

    return this.httpClient.get<IProductClass[]>(
      '/api/catalog/product-class/',
      {observe: 'response', responseType: 'json', params}
    ).pipe(
      map(resp => new PagedResponse(resp))
    );
  }

  create(entity: IProductClass): Observable<IResultResponse> {
    return this.httpClient.post(
      '/api/catalog/product-class/',
      entity,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => {
        return resp.status === 201 ? new SuccessResult() : new ErrorResult()
      }
       )
    );
  }

  update(entity: IProductClass): Observable<IResultResponse> {
    return this.httpClient.put<IProductClass>(
      entity.href,
      entity,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult())
    );
  }

  /**
   * Shortcut method; either creates or updates an object based on whether the .href
   * attribute is already set.  If not set, assumes that the object must be created.
   */
  save(entity: IProductClass): Observable<IResultResponse> {
    return (!!entity.href) ? this.update(entity) : this.create(entity);
  }

  delete(entity: IProductClass): Observable<IResultResponse> {
    return this.httpClient.delete(
      entity.href,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => resp.status === 204 ? new SuccessResult() : new ErrorResult())
    );
  }

  getFieldChoices(fieldName: string): Observable<IChoiceFieldChoice[]> {
    return this.httpClient.options<IDrfOptionsResponse>(
      '/api/catalog/product-class/',
      {observe: 'body', responseType: 'json'}
    ).pipe(
      map(
        resp => (resp.actions.POST[fieldName] as IChoiceField).choices
      )
    );
  }
}
