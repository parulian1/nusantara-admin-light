import {Injectable} from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { ISla } from '@nusantara/models';
import { SlaService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class SlaListResolver extends AbstractListResolver<ISla> {
  constructor(service: SlaService) { super(service); }
}
