import { IHrefEntity, INamedHrefEntity } from '@nusantara/models/base';

export interface IAdjustment extends IHrefEntity {
  createdBy?: INamedHrefEntity;
  reviewedBy?: INamedHrefEntity;
}
