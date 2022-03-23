import { Injectable } from '@angular/core';

import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {AbstractDetailResolver} from '@nusantara/core';
import {CatalogueService} from '@nusantara/services/catalogue.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueResolver extends AbstractDetailResolver<ICatalogue> {
  constructor(service: CatalogueService) { super(service); }

}
