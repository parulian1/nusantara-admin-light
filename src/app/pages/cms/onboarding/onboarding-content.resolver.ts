import {Injectable} from '@angular/core';
import {AbstractDetailResolver} from '../../../core';
import {IOnboardingContent} from '../../../models';
import {OnboardingContentService} from '../../../services/onboarding-content.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentResolver extends AbstractDetailResolver<IOnboardingContent> {
  constructor(service: OnboardingContentService) {
    super(service);
  }
}
