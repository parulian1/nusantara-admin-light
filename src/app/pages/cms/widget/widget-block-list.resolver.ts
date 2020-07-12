import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { widgets } from '@nusantara/models';
import { WidgetBlockService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class WidgetBlockListResolver extends AbstractListResolver<widgets.IWidgetBlock> {
  constructor(service: WidgetBlockService) { super(service); }
}
