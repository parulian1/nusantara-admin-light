import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractCrudService } from '@nusantara/core';
import { ILowStock } from '@nusantara/models/products';

@Injectable({
  providedIn: 'root'
})
export class LowStockService extends AbstractCrudService<ILowStock>{

  baseUrl = '/api/fulfillment/low-stock-reminder';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
