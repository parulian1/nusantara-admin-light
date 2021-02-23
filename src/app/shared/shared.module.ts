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
import { NusTabsComponent, NusTabComponent } from './nus-tabs';

import { FieldErrorsMarketplaceComponent } from '@nusantara/shared/field-errors-marketplace.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { TooltipComponent } from './tooltip.component';
import { EmptyListCOmponent } from './empty-list.component';
import { MarketplaceStockInfoModalComponent } from './marketplace-stock-info-modal.component';
import { MarketplaceShippingInfoModalComponent } from './marketplace-shipping-info-modal.component';
import { MarketplaceChannelInfoModalComponent } from './marketplace-channel-info-modal.component';
import { ConfirmModalReceivingOrderComponent } from './confirm-modal-receiving-order.component';
import { ConfirmModalPendingOrderComponent } from './confirm-modal-pending-order.component';

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
    NusTabsComponent,
    NusTabComponent,
    FieldErrorsMarketplaceComponent,
    ConfirmModalComponent,
    TooltipComponent,
    EmptyListCOmponent,
    MarketplaceShippingInfoModalComponent,
    ConfirmModalReceivingOrderComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceChannelInfoModalComponent,
    MarketplaceStockInfoModalComponent
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
    NusTabsComponent,
    NusTabComponent,
    FieldErrorsMarketplaceComponent,
    ConfirmModalComponent,
    TooltipComponent,
    EmptyListCOmponent,
    MarketplaceShippingInfoModalComponent,
    ConfirmModalReceivingOrderComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceChannelInfoModalComponent,
    MarketplaceStockInfoModalComponent
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
