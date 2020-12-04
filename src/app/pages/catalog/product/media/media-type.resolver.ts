import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ProductMediaService } from '@nusantara/services';

/**
 * Fetches the available types of media which can be uploaded,
 * ex, 'image', 'you_tube'.
 */
@Injectable({
  providedIn: 'root'
})
export class MediaTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: ProductMediaService) {
    super('type');
  }
}
