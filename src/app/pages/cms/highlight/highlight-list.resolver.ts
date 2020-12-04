import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IHighlight } from '@nusantara/models';
import { HighlightService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class HighlightListResolver extends AbstractListResolver<IHighlight> {
  constructor(service: HighlightService) { super(service); }
}
