import { Injectable } from '@angular/core';

import { INamedHrefEntity } from '@nusantara/models/base';
import { ProductService } from '@nusantara/services';
import { AbstractNonPaginatedListResolver } from '@nusantara/core/resolvers';

/**
 * A non-paginated list of all products.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductFullListResolver extends AbstractNonPaginatedListResolver<INamedHrefEntity> {
  constructor(protected service: ProductService) { super(); }
}
