import { Injectable } from '@angular/core';

import { IContentFooter } from '@nusantara/models';
import { AbstractDetailResolver } from '@nusantara/core';
import { ContentFooterService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ContentFooterResolver extends AbstractDetailResolver<IContentFooter> {
  constructor(service: ContentFooterService) {
    super(service);
  }
}
