import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IWidget } from '@nusantara/models';
import { WidgetService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class WidgetResolver extends AbstractDetailResolver<IWidget> {
  constructor(service: WidgetService) { super(service); }
}
