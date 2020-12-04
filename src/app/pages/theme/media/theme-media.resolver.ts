import { Injectable } from '@angular/core';

import { AbstractChoiceResolver } from '@nusantara/core';
import { ThemeMediaService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ThemeMediaResolver extends AbstractChoiceResolver {
  constructor(protected service: ThemeMediaService) {
    super('type');
  }
}
