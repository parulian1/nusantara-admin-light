import { INamedHrefEntity } from '../base';
import { IOnboardingContent } from './onboarding-content';
import { OnBoardingTypeEnum } from '@nusantara/models';

export interface IOnBoarding extends INamedHrefEntity {
  isActive?: boolean;
  contents?: IOnboardingContent[];
  type?: OnBoardingTypeEnum;
}
