import { ILocation } from './location';
import { IAddress } from './address';

export class IWarehouse {
  href: string;
  name: string;
  code: string;
  address?: IAddress;
  internalNotes?: string;
  type: string;
  isActive: boolean;
  subLocations: ILocation[];
  financialReportingAs?: string;
}
