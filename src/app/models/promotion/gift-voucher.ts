import {INamedHrefEntity} from '@nusantara/models';

export interface IGiftVoucher extends INamedHrefEntity {
  code: string;
  amount: number;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}
