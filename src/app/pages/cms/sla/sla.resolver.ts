import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ISla } from '@nusantara/models';
import { SlaService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class SlaResolver extends AbstractDetailResolver<ISla> {
  constructor(service: SlaService) { super(service); }
}
