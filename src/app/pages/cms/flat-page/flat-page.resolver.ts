import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IFlatPage } from '@nusantara/models';
import { FlatPageService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class FlatPageResolver extends AbstractDetailResolver<IFlatPage> {
  constructor(protected service: FlatPageService) { super(); }
}
