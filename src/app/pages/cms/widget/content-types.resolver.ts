import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IContentType } from '@nusantara/models/base';
import { CmsContentTypesService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class ContentTypesResolver extends AbstractListResolver<IContentType> {
  constructor(service: CmsContentTypesService) { super(service); }
}
