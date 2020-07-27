import { INamedHrefEntity } from '@nusantara/models/base';

export interface ITestimonial extends INamedHrefEntity {
  photo: string;
  content: string;
  reviewerName: string;
  reviewerJobTitle: string;
  sortPriority: string;
  isActive: boolean;
  product?: INamedHrefEntity;
  vendor?: INamedHrefEntity;
}
