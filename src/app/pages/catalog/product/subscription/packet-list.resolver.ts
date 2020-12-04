import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ProductSubscriptionService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class PacketListResolver extends AbstractChoiceResolver {
  constructor(protected service: ProductSubscriptionService) {
    super('packet');
  }
}
