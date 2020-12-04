import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { themes } from '@nusantara/models';
import { ThemeService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ThemeResolver extends AbstractDetailResolver<themes.ITheme> {
  constructor(service: ThemeService) { super(service); }
}
