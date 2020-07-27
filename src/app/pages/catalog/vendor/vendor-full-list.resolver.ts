import { Injectable } from '@angular/core';

import { INamedHrefEntity } from '@nusantara/models/base';
import { VendorService } from '@nusantara/services';
import { AbstractNonPaginatedListResolver } from '@nusantara/core/resolvers';


/**
 * A non-paginated list of all products.
 */
@Injectable({
  providedIn: 'root'
})
export class VendorFullListResolver extends AbstractNonPaginatedListResolver<INamedHrefEntity> {
  constructor(protected service: VendorService) { super(); }
}
