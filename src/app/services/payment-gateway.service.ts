import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IPaymentGateway } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService extends AbstractCrudService<IPaymentGateway> {

  baseUrl = '/api/order/payment-gateway';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
