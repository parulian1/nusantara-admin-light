import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { themes } from '@nusantara/models';


@Injectable({
  providedIn: 'root'
})
export class ThemeService extends AbstractCrudService<themes.ITheme> {

  baseUrl = '/api/client/theme';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
