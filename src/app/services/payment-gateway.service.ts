import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IPaymentGateway, PaymentTypeChoices } from '@nusantara/models';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService extends AbstractCrudService<IPaymentGateway> {

  baseUrl = '/api/order/payment-gateway';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetch(slug: string): Observable<IPaymentGateway> {
    return this.httpClient.get<IPaymentGateway>(
      `/api/order/payment-gateway/${slug}/`,
      {observe: 'body', responseType: 'json'}
    );
  }

  fetchAllByType(type: PaymentTypeChoices): Observable<IPaymentGateway[]> {
    return this.fetchAll().pipe(
      map(result => result.filter(r => r.type === type))
    );
  }
}
