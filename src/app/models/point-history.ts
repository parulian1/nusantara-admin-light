import {INamedHrefEntity} from '@nusantara/models/base';

export interface IPointHistory extends INamedHrefEntity {
  pointValue: number;
  orderNumber: string;
  date: string;
  info: string;
}
