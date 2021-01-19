
export interface IOnboardingContent {
  href: string;
  image?: string;
  sortPriority?: number;
  name: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  buttonStatus: boolean;
  modifiedBy?: string;
}
