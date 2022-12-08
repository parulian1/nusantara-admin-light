import { IAddress } from '@nusantara/shared/address';
import { ISubLocation } from './sub-location';

export class IWarehouse {
  href: string;
  name: string;
  code: string;
  address?: IAddress;
  internalNotes?: string;
  type: string;
  subLocations: ISubLocation[];
  financialReportingAs?: string;
  allowReassignmentFrom?: string[];
  isActive: boolean;
  isManagedKgx: boolean;
  phoneNumber: string;
  isAllowPickup: boolean;
}
