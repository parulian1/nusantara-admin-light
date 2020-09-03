import {Injectable} from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { IContentFooter } from '@nusantara/models';
import { ContentFooterService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class ContentFooterListResolver extends AbstractListResolver<IContentFooter> {
  constructor(service: ContentFooterService) { super(service); }
}
