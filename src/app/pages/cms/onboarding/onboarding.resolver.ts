import { Injectable } from '@angular/core';
import { AbstractDetailResolver } from '@nusantara/core';
import { OnboardingService } from '@nusantara/services';
import { IOnBoarding } from '@nusantara/models';

@Injectable({
  providedIn: 'root',
})
export class OnboardingResolver extends AbstractDetailResolver<IOnBoarding> {
  constructor(service: OnboardingService) {
    super(service);
  }
}
