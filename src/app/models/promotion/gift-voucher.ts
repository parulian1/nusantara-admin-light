import {INamedHrefEntity, INamedHrefEntityWarehouse} from '@nusantara/models';

export interface IGiftVoucher extends INamedHrefEntity {
  code: string;
  amount: number;
  validFrom: string;
  validTo?: string;
  redeemDate?: string;
  isActive: boolean;
  allWarehouse: boolean;
  warehouses?: INamedHrefEntityWarehouse[];
}
