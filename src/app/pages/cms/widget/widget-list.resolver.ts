import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IWidget } from '@nusantara/models';
import { WidgetService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class WidgetListResolver extends AbstractListResolver<IWidget> {
  constructor(service: WidgetService) { super(service); }
}
