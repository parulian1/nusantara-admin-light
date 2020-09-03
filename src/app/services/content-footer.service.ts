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
}
