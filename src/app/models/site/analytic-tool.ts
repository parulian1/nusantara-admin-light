import {IHrefEntity} from '@nusantara/models';

export enum AnalyticToolChoices {
  GA = 'ga',
  GTM = 'gtm',
}


export interface IConfigAnalyticTool extends IHrefEntity {
  type: string;
  trackingId: string;
}
