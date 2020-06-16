import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { WarehouseService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class WarehouseTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: WarehouseService) {
    super('type');
  }
}
