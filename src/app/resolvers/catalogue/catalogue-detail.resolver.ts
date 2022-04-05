import { Injectable } from '@angular/core';
import {AbstractDetailResolver} from '@nusantara/core';
import {ICatalogue} from '@nusantara/models/catalogue/catalogue';
import {CatalogueService} from '@nusantara/services/catalogue.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueDetailResolver extends AbstractDetailResolver<ICatalogue> {
  constructor(service: CatalogueService) {
    super(service);
  }
}
