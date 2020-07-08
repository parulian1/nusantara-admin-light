import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { ICategory } from '@nusantara/models';
import { CategoryService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class CategoryListResolver extends AbstractListResolver<ICategory> {
  constructor(service: CategoryService) { super(service); }
}
