import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IWidgetBlock } from '@nusantara/models/widgets';
import { WidgetBlockService } from '@nusantara/services';


@Injectable({
  providedIn: 'root',
})
export class WidgetBlockResolver extends AbstractDetailResolver<IWidgetBlock> {
  constructor(service: WidgetBlockService) { super(service); }
}
