import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IChoiceField, IChoiceFieldChoice, IDrfOptionsResponse, } from '@nusantara/core';
import { ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core/responses';
import { IProductAttribute } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService {

  constructor(private httpClient: HttpClient) { }

  create(entity: IProductAttribute): Observable<IResultResponse> {
    return this.httpClient.post(
      '/api/catalog/product-attribute/',
      entity,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => {
          return resp.status === 201 ? new SuccessResult() : new ErrorResult();
        }
      )
    );
  }

  update(entity: IProductAttribute): Observable<IResultResponse> {
    return this.httpClient.put(
      entity.href,
      entity,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult())
    );
  }

  save(entity: IProductAttribute): Observable<IResultResponse> {
    return !!(entity.href) ? this.update(entity) : this.create(entity);
  }

  delete(entity: IProductAttribute): Observable<IResultResponse> {
    return this.httpClient.delete(
      entity.href,
      {observe: 'response', responseType: 'json'}
    ).pipe(
      map(resp => resp.status === 204 ? new SuccessResult() : new ErrorResult())
    );
  }

  /**
   * Gets the possible values for a 'choice' field in the model.
   * @param fieldName The string name of the field to fetch
   */
  getFieldChoices(fieldName: string): Observable<IChoiceFieldChoice[]> {
    return this.httpClient.options<IDrfOptionsResponse>(
      '/api/catalog/product-attribute/',
      {observe: 'body', responseType: 'json'}
    ).pipe(
      map(resp => (resp.actions.POST[fieldName] as IChoiceField).choices)
    );
  }
}

