import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core';
import { products } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ProductRelatedService {

  baseUrl = '/api/catalog/product-relation';

  constructor(private httpClient: HttpClient) {}

  fetch(slug: string): Observable<products.IProductRelation[]> {
    return this.httpClient.get<products.IProductRelation[]>(
      `${this.baseUrl}/${slug}/`
    );
  }

  post(formData: FormData): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/`,
      formData
    );
  }

}
