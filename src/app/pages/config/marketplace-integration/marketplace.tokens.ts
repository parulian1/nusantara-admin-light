import { InjectionToken } from '@angular/core';
import { StoreConfig } from '@ngrx/store/src/store_module';
import * as fromReducer from '@nusantara/reducers';
import * as fromActions from '@nusantara/actions';

export const MARKETPLACE_STORAGE_KEYS = new InjectionToken<keyof fromReducer.State[]>('MarketplacesStorageKeys');
export const MARKETPLACE_LOCAL_STORAGE_KEY = new InjectionToken<string[]>('MarketplacesStorage');
export const MARKETPLACE_CONFIG_TOKEN = new InjectionToken<StoreConfig<fromReducer.State, fromActions.MarketplaceActions>>('MarketplacesConfigToken');
