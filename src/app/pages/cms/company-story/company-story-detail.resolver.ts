import { Injectable } from '@angular/core';

import { ICompanyStory } from '@nusantara/models';
import { AbstractDetailResolver } from '@nusantara/core';
import { CompanyStoryService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class CompanyStoryDetailResolver extends AbstractDetailResolver<ICompanyStory> {
  constructor(service: CompanyStoryService) {
    super(service);
  }
}
