import { INamedHrefEntity } from '@nusantara/models/base';

export interface ICompanyStory extends INamedHrefEntity {
  name: string;
  description: string;
  priority: number;
  image: string;
  isActive: boolean;
}
