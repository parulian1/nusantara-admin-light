import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IClient, IMarketplaceWarehouse, IShop } from '@nusantara/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarketplaceClientService extends AbstractCrudService<IShop> {
  baseUrl = '/api/marketplace';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  get client(): Observable<IClient[]> {
    return this.httpClient.get<IClient[]>(`${this.baseUrl}/client/`);
  }

  getWarehouse(marketplace: string): Observable<IMarketplaceWarehouse[]> {
    return this.httpClient.get<IMarketplaceWarehouse[]>(
      `${this.baseUrl}/warehouse/${marketplace}/`
    );
  }

  getConnection(shopId: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}/client-authorization/${shopId}/`
    );
  }

  connect(formData: FormData): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/client-authorization/`,
      formData
    );
  }

  updateConnection(formData: FormData, shopId: string): Observable<any> {
    return this.httpClient.put(
      `${this.baseUrl}/client-authorization/${shopId}/`,
      formData
    );
  }

  getWarehouseInformation(code: any): Observable<any>{
    return this.httpClient.get<any>(
      `${this.baseUrl}/warehouse-information/${code}/`
    );
  }
}
