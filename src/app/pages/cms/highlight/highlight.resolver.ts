import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { HighlightService } from '@nusantara/services';
import { IHighlight } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class HighlightResolver extends AbstractDetailResolver<IHighlight> {
  constructor(service: HighlightService) { super(service); }
}
