import { Action } from '@ngrx/store';
import { marketplace } from '../models';


export enum MarketplaceActionTypes {
  SetCurrentShop = '[Marketplace] Set Current Shop'
}

export class SetCurrentShop implements Action {
  readonly type = MarketplaceActionTypes.SetCurrentShop;

  constructor(public payload: marketplace.IShop) {}
}

export type MarketplaceActions = SetCurrentShop;
