import { ILocation } from './location';
import { IAddress } from './address';

export class IWarehouse {
  href: string;
  name: string;
  code: string;
  address?: IAddress;
  notes: string;
  internalNotes?: string;
  type: string;
  isActive: boolean;
  subLocations: ILocation[];
}
