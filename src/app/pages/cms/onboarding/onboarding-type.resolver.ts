import {Injectable} from '@angular/core';
import {AbstractChoiceResolver} from '@nusantara/core';
import {OnboardingService} from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class OnboardingTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: OnboardingService) {
    super('type');
  }
}
