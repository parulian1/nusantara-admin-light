import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {INavigation, IRelativeChoices} from '@nusantara/models';
import {AbstractCrudService} from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService extends AbstractCrudService<INavigation> {

  baseUrl = '/api/cms/navigation/navbar/item';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  // retrieves a single object from the API based on it's slug
  fetchDetailWithParam(slug?: string, params?: HttpParams): Observable<INavigation> {
    let url = `${this.baseUrl}/`;
    if (!!slug) {
      url += `${slug}/`;
    }
    return this.httpClient
      .get<INavigation>(`${url}`, {observe: 'body', responseType: 'json', params});
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
