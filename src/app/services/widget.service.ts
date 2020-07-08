import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core/http';
import { IWidget } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class WidgetService extends AbstractCrudService<IWidget> {

  baseUrl = '/api/cms/widget';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
