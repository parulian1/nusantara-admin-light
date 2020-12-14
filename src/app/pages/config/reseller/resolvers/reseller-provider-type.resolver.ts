import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ResellerService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ResellerProviderTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: ResellerService) {
    super('type');
  }
}
