import { Injectable } from '@angular/core';

import { IOrder } from '@nusantara/models';
import { OrderService } from '@nusantara/services';
import { AbstractListResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class OrderListResolver extends AbstractListResolver<IOrder> {
  constructor(service: OrderService) { super(service); }
}
