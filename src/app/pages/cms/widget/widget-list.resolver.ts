import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core/resolvers';
import { IWidget } from '@nusantara/models';
import { WidgetService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class WidgetListResolver extends AbstractListResolver<IWidget> {
  constructor(protected service: WidgetService) { super(); }
}
