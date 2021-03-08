import {INamedHrefEntity} from '../base';
import {ISubLocation} from '../sub-location';
import {IAddress} from '../../shared/address';

export interface IStockSearch extends INamedHrefEntity {
  href: string;
  quantity: string;
  name: string;
  code: string;
  type: string;
  subLocations?: Array<ISubLocationWithQuantity>;
  address?: IAddress;
}

export interface ISubLocationWithQuantity extends ISubLocation {
  quantity?: number;
}
