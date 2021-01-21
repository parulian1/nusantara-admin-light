import {Injectable} from '@angular/core';
import {AbstractCrudService} from '@nusantara/core';
import {HttpClient} from '@angular/common/http';
import {IOnBoarding} from "@nusantara/models";

@Injectable({
  providedIn: 'root'
})
export class OnboardingService extends AbstractCrudService<IOnBoarding> {

  baseUrl = '/api/cms/onboarding';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
