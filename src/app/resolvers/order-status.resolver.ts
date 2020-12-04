import {Injectable} from '@angular/core';
import {AbstractChoiceResolver} from '../core/resolvers';
import {OrderService} from '../services';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusResolver extends AbstractChoiceResolver {
  constructor(protected service: OrderService) {
    super('status');
  }
}
