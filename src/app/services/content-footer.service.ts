import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';

import { IContentFooter, IRelativeChoices } from '@nusantara/models';
import { AbstractCrudService } from '@nusantara/core';


@Injectable({
  providedIn: 'root'
})
export class ContentFooterService extends AbstractCrudService<IContentFooter> {
  baseUrl = '/api/cms/navigation/content_footer/item';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  fetchRelativeChoices(slug: string = ''): Observable<IRelativeChoices[]> {
    return this.httpClient
      .post<IRelativeChoices[]>(
        `${this.baseUrl}/relative-choices/`,
        { slug },
        {observe: 'body', responseType: 'json'}
      );
  }

  // retrieves a single object from the API based on it's slug
  fetch(slug?: string): Observable<IContentFooter> {
    const params = new HttpParams().set('include_deleted', 'true');

    let url = `${this.baseUrl}/`;
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<IContentFooter>(`${url}`, {observe: 'body', responseType: 'json', params});
  }
}
