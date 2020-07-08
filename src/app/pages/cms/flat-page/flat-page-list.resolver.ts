import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IFlatPage } from '@nusantara/models';
import { FlatPageService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class FlatPageListResolver extends AbstractListResolver<IFlatPage> {
  constructor(service: FlatPageService) { super(service); }
}
