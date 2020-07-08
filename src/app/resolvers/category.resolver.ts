import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';

/**
 * Finds a single category, based on it's slug in the route.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryResolver extends AbstractDetailResolver<ICategory> {
  constructor(service: CategoryService) { super(service); }
}
