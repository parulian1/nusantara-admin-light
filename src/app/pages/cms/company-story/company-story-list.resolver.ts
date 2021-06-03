import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { ICompanyStory } from '@nusantara/models';
import { CompanyStoryService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class CompanyStoryListResolver extends AbstractListResolver<ICompanyStory> {
  constructor(service: CompanyStoryService) { super(service); }
}
