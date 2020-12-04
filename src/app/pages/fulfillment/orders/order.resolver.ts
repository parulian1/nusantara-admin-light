import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IOrder } from '@nusantara/models';
import { OrderService } from '@nusantara/services';

/**
 * Finds a single category, based on it's slug in the route.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderResolver extends AbstractDetailResolver<IOrder> {
  constructor(service: OrderService) { super(service); }
}
