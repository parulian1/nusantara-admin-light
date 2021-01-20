import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntityToSlugPipe } from './entity-to-slug.pipe';
import { PaginationComponent } from './pagination.component';
import { DetailTitleComponent } from './detail-title.component';
import { ListHeaderComponent } from './list-header.component';
import { DetailActionsComponent } from './detail-actions.component';
import { TrueFalseComponent } from './true-false.component';
import { CamelToHumanizedPipe } from './camel-to-humanized.pipe';
import { AddressComponent } from './address';
import { FieldErrorsComponent } from './field-errors.component';
import { NonFieldErrorsComponent } from './non-field-errors.component';
import { SpinnerComponent } from './spinner.component';
import { ProductSelectionModalComponent } from '@nusantara/shared/product-selection-modal.component';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { PaginationChildComponent } from '@nusantara/shared/pagination-child.component';
import { UserSelectionModalComponent } from '@nusantara/shared/user-selection-modal.component';
import { CustomerGroupModalComponent } from '@nusantara/shared/customer-group-modal.component';
import { IncludeDeletedComponent } from './filters/include-deleted.component';
import { IncludeInactiveComponent } from './filters/include-inactive.component';

import { FieldErrorsMarketplaceComponent } from '@nusantara/shared/field-errors-marketplace.component';
import { ListHeaderMarketplaceComponent } from '@nusantara/shared/list-header-marketplace.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';
import { EmptyListCOmponent } from './empty-list.component';
import { MarketplaceInfoDetailProductPageComponent } from "@nusantara/shared/marketplace-info-detail-product-page.component";
import { MarketplaceInfoShippingModalComponent } from '@nusantara/shared/marketplace-info-shipping-modal.component';
import { MarketplaceInfoDetailModalComponent } from '@nusantara/shared/marketplace-info-detail-modal.component';
import { ConfirmModalReceivingOrderComponent } from '@nusantara/shared/confirm-modal-receiving-order.component';
import { ConfirmModalPendingOrderComponent } from '@nusantara/shared/confirm-modal-pending-order.component';
import { DetailActionsMpComponent } from '@nusantara/shared/detail-actions-mp.component';

/**
 * The purpose of this module is to make common code (like pipes)
 * easily importable to any modules that need them.
 */
@NgModule({
  declarations: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    PaginationComponent,
    DetailTitleComponent,
    DetailActionsComponent,
    ListHeaderComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
    ProductSelectionModalComponent,
    PaginationChildComponent,
    UserSelectionModalComponent,
    IncludeDeletedComponent,
    CustomerGroupModalComponent,
    IncludeInactiveComponent,
    FieldErrorsMarketplaceComponent,
    ListHeaderMarketplaceComponent,
    ConfirmModalComponent,
    TabComponent,
    TabsComponent,
    EmptyListCOmponent,
    MarketplaceInfoShippingModalComponent,
    ConfirmModalReceivingOrderComponent,
    DetailActionsMpComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceInfoDetailModalComponent,
    MarketplaceInfoDetailProductPageComponent
  ],
  exports: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    PaginationComponent,
    DetailTitleComponent,
    ListHeaderComponent,
    DetailActionsComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
    ProductSelectionModalComponent,
    PaginationChildComponent,
    UserSelectionModalComponent,
    IncludeDeletedComponent,
    CustomerGroupModalComponent,
    IncludeInactiveComponent,
    FieldErrorsMarketplaceComponent,
    ListHeaderMarketplaceComponent,
    ConfirmModalComponent,
    TabComponent,
    TabsComponent,
    EmptyListCOmponent,
    MarketplaceInfoShippingModalComponent,
    ConfirmModalReceivingOrderComponent,
    DetailActionsMpComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceInfoDetailModalComponent,
    MarketplaceInfoDetailProductPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SharedModule {}
