import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@nusantara/shared';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SetupComponent } from './setup/setup.component';
import { EditShippingComponent } from './setup/edit-shipping.component';
import {
  ConnectionFormComponent,
  ShopeeeClientFormComponent,
  TokopediaClientFormComponent,
} from './setup/connection';
import {
  ProductClassMappingListComponent,
  ProductClassMappingFormComponent,
} from './setup/product-class-mapping';
import { CategorySelectionFormComponent } from './setup/product-class-mapping/category-selection-form/category-selection-form.component';
import { CategoryGroupControlComponent } from './setup/product-class-mapping/category-selection-form/category-group-control.component';
import { AttributeSelectionFormComponent } from './setup/product-class-mapping/attribute-selection-form';
import { AttributeMatchingFormComponent } from './setup/product-class-mapping/attribute-matching-form';
import { VariantFormComponent } from './setup/connection/form/variant-form.component';
import { MarketplaceIntegrationComponent } from './marketplace-integration.component';
import { PublishListComponent } from './publish/publish-list.component';
import { PublishDetailComponent } from './publish/publish-detail.component';
import { MarketplaceIntegrationRoutingModule } from './marketplace-integration-routing.module';
import { TscFormComponent } from './setup/connection/form/tsc-form.component';

import { StoreModule } from '@ngrx/store';
import { LocalStorageService } from '@nusantara/services';
import { storageMetaReducer } from '@nusantara/storage-metareducer';
import {
  MARKETPLACE_LOCAL_STORAGE_KEY,
  MARKETPLACE_STORAGE_KEYS,
  MARKETPLACE_CONFIG_TOKEN,
} from './marketplace.tokens';
import * as fromReducer from '@nusantara/reducers/marketplace.reducers';

export function getMarketplacesConfig(
  saveKeys: string[],
  localStorageKey: string,
  storageService: LocalStorageService
) {
  return {
    metaReducers: [
      storageMetaReducer(saveKeys, localStorageKey, storageService),
    ],
  };
}

@NgModule({
  declarations: [
    SetupComponent,
    EditShippingComponent,
    ConnectionFormComponent,
    ShopeeeClientFormComponent,
    TokopediaClientFormComponent,
    ProductClassMappingListComponent,
    ProductClassMappingFormComponent,
    CategorySelectionFormComponent,
    CategoryGroupControlComponent,
    AttributeSelectionFormComponent,
    AttributeMatchingFormComponent,
    VariantFormComponent,
    PublishListComponent,
    PublishDetailComponent,
    MarketplaceIntegrationComponent,
    TscFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forChild(),
    SharedModule,
    StoreModule.forFeature(
      'marketplace',
      fromReducer.reducer,
      MARKETPLACE_CONFIG_TOKEN
    ),
    MarketplaceIntegrationRoutingModule,
  ],
  providers: [
    {
      provide: MARKETPLACE_LOCAL_STORAGE_KEY,
      useValue: '__marketplace_storage__',
    },
    {
      provide: MARKETPLACE_STORAGE_KEYS,
      useValue: ['currentShop'],
    },
    {
      provide: MARKETPLACE_CONFIG_TOKEN,
      deps: [
        MARKETPLACE_STORAGE_KEYS,
        MARKETPLACE_LOCAL_STORAGE_KEY,
        LocalStorageService,
      ],
      useFactory: getMarketplacesConfig,
    },
  ],
})
export class MarketplaceIntegrationModule {}
