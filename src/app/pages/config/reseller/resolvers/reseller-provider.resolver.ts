import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IReseller } from '@nusantara/models';
import { ResellerService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ResellerProviderResolver extends AbstractDetailResolver<IReseller> {
  constructor(service: ResellerService) { super(service); }

}
