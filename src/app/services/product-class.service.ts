import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core/http';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductClassService extends AbstractCrudService<products.IProductClass> {

  baseUrl = '/api/catalog/product-class';

  constructor(protected httpClient: HttpClient) { super(); }

  fetch(slug: string): Observable<products.IProductClass> {
    return this.httpClient.get<products.IProductClass>(
      `/api/catalog/product-class/${slug}/`,
      {observe: 'body', responseType: 'json'}
    );
  }
}
