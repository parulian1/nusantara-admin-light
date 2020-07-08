import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICategory } from '@nusantara/models';
import { AbstractCrudService, ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends AbstractCrudService<ICategory> {

  baseUrl = '/api/catalog/category';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  create(entity: ICategory): Observable<IResultResponse> {
    return super.create(entity);
  }

  uploadImage(entity: ICategory, imageValue: File): Observable<IResultResponse> {
    const fd = new FormData();
    fd.append('image', imageValue);

    return this.httpClient.patch(
      entity.href,
      fd, { observe: 'response' }
    ).pipe(
      map(resp => resp.status === 200 ? new SuccessResult() : new ErrorResult() )
    );
  }

  /**
   * Not all categories can be 'parents' for other categories.
   * We only support 3 levels of nesting for categories, so only
   * depth 1 or 2 categories ca be parents.
   *
   * Special note -> We want to fetch **all** the results here (non-paged)
   * so this call is made with a page_size=999.
   */
  fetchAvailableParentCategories(): Observable<ICategory[]> {

    const params = new HttpParams()
      .append('per_page', '999')
      .append('depth__lte', '2');

    return this.httpClient
      .get<ICategory[]>(`${this.baseUrl}/`, {observe: 'body', responseType: 'json', params});
  }

}
