import { Injectable } from '@angular/core';

import { IPaymentGateway } from '@nusantara/models';
import { PaymentGatewayService } from '@nusantara/services';
import { AbstractListResolver } from '@nusantara/core/resolvers';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayListResolver extends AbstractListResolver<IPaymentGateway> {
  constructor(protected service: PaymentGatewayService) { super(); }
}
