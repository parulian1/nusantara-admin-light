import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  fetchRelativeChoices(slug: string = ''): Observable<IRelativeChoices[]> {
    return this.httpClient
      .post<IRelativeChoices[]>(
        `${this.baseUrl}/relative-choices/`,
        { slug },
        {observe: 'body', responseType: 'json'}
      );
  }
}
