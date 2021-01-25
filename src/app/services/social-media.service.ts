import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ISocialMedia } from '@nusantara/models';
import { AbstractCrudService } from '@nusantara/core';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService extends AbstractCrudService<ISocialMedia> {

  baseUrl = '/api/client/social-media';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
