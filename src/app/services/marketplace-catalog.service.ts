import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PagedResponse } from '@nusantara/core';
import { IShop, IProductCategory } from '@nusantara/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceCatalogService {
  baseUrl = '/api/catalog/product-class';

  constructor(private httpClient: HttpClient) {}

  patchNewAttribute(formData: FormData, productClassSlug:string): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${productClassSlug}/`,formData
    );
  }
}
