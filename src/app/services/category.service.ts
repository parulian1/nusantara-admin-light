import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ICategory } from '@nusantara/models';
import { AbstractCrudService } from '@nusantara/core/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractCrudService<ICategory> {

  baseUrl = 'api/catalog/category';

  constructor(protected httpClient: HttpClient) {
    super();
   }
}
