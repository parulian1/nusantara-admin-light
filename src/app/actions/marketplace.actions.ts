import { Action } from '@ngrx/store';
import { IShop } from '../models';


export enum MarketplaceActionTypes {
  SetCurrentShop = '[Marketplace] Set Current Shop'
}

export class SetCurrentShop implements Action {
  readonly type = MarketplaceActionTypes.SetCurrentShop;

  constructor(public payload: IShop) {}
}

export type MarketplaceActions = SetCurrentShop;
