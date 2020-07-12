import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { widgets } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class WidgetBlockService extends AbstractCrudService<widgets.IWidgetBlock> {

  baseUrl = '/api/cms/widget-block';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
