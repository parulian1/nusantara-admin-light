import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IPaymentGateway } from '@nusantara/models';
import { PaymentGatewayService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayListResolver extends AbstractListResolver<IPaymentGateway> {
  constructor(service: PaymentGatewayService) { super(service); }
}
