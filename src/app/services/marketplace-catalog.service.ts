import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceCatalogService {
  baseUrl = '/api/catalog';

  constructor(private httpClient: HttpClient) {}

  patchNewAttribute(formData: FormData, productClassSlug: string): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/product-class-attribute/${productClassSlug}/`, formData
    );
  }
}
