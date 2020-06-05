import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IChoiceField, IChoiceFieldChoice, IDrfOptionsResponse } from '@nusantara/core';
import { AbstractCrudService } from '@nusantara/core/http';
import { IProductClass } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductClassService extends AbstractCrudService<IProductClass> {

  baseUrl = '/api/catalog/product-class';

  constructor(protected httpClient: HttpClient) { super(); }

  fetch(slug: string): Observable<IProductClass> {
    return this.httpClient.get<IProductClass>(
      `/api/catalog/product-class/${slug}/`,
      {observe: 'body', responseType: 'json'}
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
