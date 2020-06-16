import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { SubLocationService } from '@nusantara/services/sub-location.service';

@Injectable({
  providedIn: 'root'
})
export class SubLocationTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: SubLocationService) {
    super('type');
  }
}
