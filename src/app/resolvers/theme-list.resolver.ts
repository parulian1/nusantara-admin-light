import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { themes } from '@nusantara/models';
import { ThemeService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ThemeListResolver extends AbstractListResolver<themes.ITheme> {
  constructor(service: ThemeService) { super(service); }
}
