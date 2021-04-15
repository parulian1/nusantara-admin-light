import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class CompanyStoryService extends AbstractCrudService<ICompanyStory> {

  baseUrl = '/api/cms/company-story';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
