import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MarketplaceActions, MarketplaceActionTypes } from '@nusantara/actions';
import { IShop } from '@nusantara/models';

export interface State {
  currentShop: IShop;
}

export const state = createFeatureSelector('marketplace');
export const getCurrentShop = createSelector(
  state,
  (marketplaceState: State): IShop => marketplaceState.currentShop
);

export function reducer(
  state: State,
  action: MarketplaceActions
): State {
  switch (action.type) {
    case MarketplaceActionTypes.SetCurrentShop:
      return {
        ...state,
        currentShop: action.payload,
      };
    default:
      return state;
  }
}
