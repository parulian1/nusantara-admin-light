import { IHrefEntity } from '../base';

export interface IShipmentHistory extends IHrefEntity {
  status?: string;
  notes?: string;
  connoteDate?: string;
  meta?: any;
}
