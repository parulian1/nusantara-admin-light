import {INamedHrefEntity} from '@nusantara/models/base';
import {IPointHistory} from '@nusantara/models/point-history';

export interface IPoint extends INamedHrefEntity {
  total: number;
}

export interface IPointSummary extends IPoint {
  pointHistory?: Array<IPointHistory>;
}
