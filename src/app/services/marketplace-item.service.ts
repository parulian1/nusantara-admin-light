import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceItemService {
  baseUrl = '/api/marketplace/item';

  constructor(private httpClient: HttpClient) {}

  getItemMarketplaceInformation(productSlug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productSlug}/information/`
    );
  }

  getItemMarketplaceLogisticInformation(productSlug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productSlug}/logistic-information/`
    );
  }

  getItemMarketplaceAttribute(marketplace: string, productClassSlug: string, productSlug: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/${productClassSlug}/${marketplace}/attribute/?product=${productSlug}`
    );
  }

  patchItemAttribute(formData: FormData, productClassSlug: string): Observable<any> {
    return this.httpClient.patch(
      `${this.baseUrl}/${productClassSlug}/attribute/`,formData
    );
  }
}
