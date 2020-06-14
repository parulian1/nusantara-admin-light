import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IPaymentGateway } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService extends AbstractCrudService<IPaymentGateway> {

  baseUrl = '/api/order/payment-gateway';

  constructor(protected httpClient: HttpClient) {
    super();
  }
}
