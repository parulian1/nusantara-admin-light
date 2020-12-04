import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { IHighlight } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class HighlightService extends AbstractCrudService<IHighlight> {

  baseUrl = '/api/cms/highlight';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
