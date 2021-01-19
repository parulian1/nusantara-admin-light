import { Injectable } from '@angular/core';
import { AbstractDetailResolver } from '@nusantara/core';
import { IOnboardingContent } from '@nusantara/models';
import { OnboardingService } from '@nusantara/services/onboarding-content.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentResolver extends AbstractDetailResolver<IOnboardingContent> {
  constructor(service: OnboardingService) {
    super(service);
  }
}
