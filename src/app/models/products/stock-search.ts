import {INamedHrefEntity} from '../base';
import {ISubLocation} from '../sub-location';
import {IAddress} from '../../shared/address';

export interface IStockSearch extends INamedHrefEntity {
  href: string;
  quantity: string;
  name: string;
  code: string;
  type: string;
  subLocations?: Array<ISubLocation>;
  address?: IAddress;
}
