import {Injectable} from '@angular/core';
import {AbstractCrudService} from '../core';
import {IOnboardingContent} from '../models';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingContentService extends AbstractCrudService<IOnboardingContent> {

  baseUrl = '/api/cms/onboardingcontent';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
