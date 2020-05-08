import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { IEntityHref } from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) { }

  fetch(slug: string): Observable<ICategory> {
    return this.httpClient.get<ICategory>(
      `/api/catalog/category/${slug}/`,
      {observe: 'body', responseType: 'json'}
    );
  }

  fetchList(): Observable<ICategory[]> {
    return this.httpClient.get<ICategory[]>(
      '/api/catalog/category/',
      {observe: 'body', responseType: 'json'}
    );
  }

  createRootCategory(entity: ICategory): Observable<boolean> {
    return of(true);
  }

  createChildCategory(parent: IEntityHref, entity: ICategory): Observable<boolean> {
    return of(true);
  }

  updateCategory(entity: ICategory): Observable<ICategory> {
    return of(null);
  }
}

export interface ICategoryViewModel {
  name: string;
  parent: string;
  icon: string;
  sourceMappings: string[];
}

export interface ICategory {
  name: string;
  href: string;
  parent: string;
  products: {
    href: string;
    count: number;
  };
  sourceMappings: string[];
  icon: {
    href: string;
    height: number;
    width: number;
  };
  children: Array<ICategory>;
}
