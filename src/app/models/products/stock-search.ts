import {INamedHrefEntity} from '../base';
import {ISubLocation} from '../sub-location';
import {IAddress} from '../../shared/address';
import {IStockRecordSearch} from '@nusantara/models/inventory';

export interface IStockSearch extends INamedHrefEntity {
  href: string;
  quantity: number;
  name: string;
  code: string;
  type: string;
  subLocations?: Array<ISubLocationWithQuantity>;
  address?: IAddress;
}

export interface ISubLocationWithQuantity extends ISubLocation {
  quantity?: number;
  skuList?: Array<IStockRecordSearch>;
  displaySku: boolean;
}

export interface IBundleStockSearch {
  product: string;
  name: string;
  upc: string;
  weight?: number;
  quantity?: number;
  price?: number;
}
