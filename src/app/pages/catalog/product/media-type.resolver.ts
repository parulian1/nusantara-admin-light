import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class MediaTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: ProductMediaService) {
    super('type');
  }
}
