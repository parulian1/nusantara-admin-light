import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@nusantara/shared";
import { NgxSmartModalModule } from "ngx-smart-modal";

import { SetupComponent } from "./setup/setup.component";
import { EditShippingComponent } from "./setup/edit-shipping.component";
import {
  ConnectComponent,
  ConnectionFormComponent,
  VariantFormComponent,
  ShopeeeClientFormComponent,
  TokopediaClientFormComponent,
  TscFormComponent,
} from "./connect";
import {
  ProductClassMappingListComponent,
  ProductClassMappingFormComponent,
} from "./setup/product-class-mapping";

import {
  CategorySelectionFormComponent,
  CategoryGroupControlComponent,
  AttributeSelectionFormComponent,
  AttributeMatchingFormComponent,
} from "./setup";

import { PublishListComponent, PublishDetailComponent } from "./publish";
import { MarketplaceIntegrationComponent } from "./marketplace-integration.component";
import { MarketplaceIntegrationRoutingModule } from "./marketplace-integration-routing.module";

import { StoreModule } from "@ngrx/store";
import { LocalStorageService } from "@nusantara/services";
import { storageMetaReducer } from "@nusantara/storage-metareducer";
import {
  MARKETPLACE_LOCAL_STORAGE_KEY,
  MARKETPLACE_STORAGE_KEYS,
  MARKETPLACE_CONFIG_TOKEN,
} from "./marketplace.tokens";
import * as fromReducer from "@nusantara/reducers/marketplace.reducers";
import {CallbackFormComponent} from "./connect/callback-form.component";
import {LazadaFormComponent} from "./connect/form/lazada-form.component";

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
    ConnectComponent,
    ConnectionFormComponent,
    VariantFormComponent,
    ShopeeeClientFormComponent,
    TokopediaClientFormComponent,
    TscFormComponent,
    SetupComponent,
    ProductClassMappingListComponent,
    ProductClassMappingFormComponent,
    CategorySelectionFormComponent,
    CategoryGroupControlComponent,
    AttributeSelectionFormComponent,
    AttributeMatchingFormComponent,
    EditShippingComponent,
    PublishListComponent,
    PublishDetailComponent,
    MarketplaceIntegrationComponent,
    CallbackFormComponent,
    LazadaFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSmartModalModule.forChild(),
    SharedModule,
    StoreModule.forFeature(
      "marketplace",
      fromReducer.reducer,
      MARKETPLACE_CONFIG_TOKEN
    ),
    MarketplaceIntegrationRoutingModule,
  ],
  providers: [
    {
      provide: MARKETPLACE_LOCAL_STORAGE_KEY,
      useValue: "__marketplace_storage__",
    },
    {
      provide: MARKETPLACE_STORAGE_KEYS,
      useValue: ["currentShop"],
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
