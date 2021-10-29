import {IHrefEntity, ISubLocation} from '@nusantara/models';

export interface IWarehouseMapping extends IHrefEntity{
  href: string;
  type: string;
  location: ISubLocation;
  warehouseId: string;
}
