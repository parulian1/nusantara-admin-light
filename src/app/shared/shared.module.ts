import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { EntityToSlugPipe } from './entity-to-slug.pipe';
import { PaginationComponent } from './pagination.component';
import { PaginationChildComponent } from '@nusantara/shared/pagination-child.component';
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

import { UserSelectionModalComponent } from '@nusantara/shared/user-selection-modal.component';
import { CustomerGroupModalComponent } from '@nusantara/shared/customer-group-modal.component';
import { IncludeDeletedComponent } from './filters/include-deleted.component';
import { IncludeInactiveComponent } from './filters/include-inactive.component';
import { SortToggleComponent } from './sort-toggle.component';
import { MilestoneComponent } from './milestone.component';
import { ActivityTrackingComponent } from './activity-tracking.component';
import { NusTabsComponent, NusTabComponent } from './nus-tabs';
import { FieldErrorsMarketplaceComponent } from '@nusantara/shared/field-errors-marketplace.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { TooltipComponent } from './tooltip.component';
import { EmptyListComponent} from './empty-list.component';
import { MarketplaceStockInfoModalComponent } from './marketplace-stock-info-modal.component';
import { MarketplaceShippingInfoModalComponent } from './marketplace-shipping-info-modal.component';
import { MarketplaceChannelInfoModalComponent } from './marketplace-channel-info-modal.component';
import { ConfirmModalReceivingOrderComponent } from './confirm-modal-receiving-order.component';
import { ConfirmModalPendingOrderComponent } from './confirm-modal-pending-order.component';
import { OrderType } from './order-type.pipe';
import { OnlyNumberDirective } from './only-number.directive';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { FieldDatetimeComponent } from '@nusantara/shared/field-datetime.component';
import { GetUserDisplayNamePipe } from './get-user-display-name.pipe';
import { StockRecordSelectionModalComponent } from '@nusantara/shared/stock-record-selection-modal.component';
import { ConfirmModalResetPinComponent } from '@nusantara/shared/confirm-modal-reset-pin.component';
import { CsvDialogComponent } from './csv-dialog/csv-dialog.component';
import {VendorSelectionModalComponent} from '@nusantara/shared/vendor-selection-modal/vendor-selection-modal.component';

/**
 * The purpose of this module is to make common code (like pipes)
 * easily importable to any modules that need them.
 */
@NgModule({
  declarations: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    GetUserDisplayNamePipe,
    PaginationComponent,
    DetailTitleComponent,
    DetailActionsComponent,
    ListHeaderComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    FieldDatetimeComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
    ProductSelectionModalComponent,
    StockRecordSelectionModalComponent,
    PaginationChildComponent,
    UserSelectionModalComponent,
    IncludeDeletedComponent,
    CustomerGroupModalComponent,
    IncludeInactiveComponent,
    SortToggleComponent,
    MilestoneComponent,
    ActivityTrackingComponent,
    NusTabsComponent,
    NusTabComponent,
    FieldErrorsMarketplaceComponent,
    ConfirmModalComponent,
    TooltipComponent,
    EmptyListComponent,
    MarketplaceShippingInfoModalComponent,
    ConfirmModalReceivingOrderComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceChannelInfoModalComponent,
    MarketplaceStockInfoModalComponent,
    OrderType,
    OnlyNumberDirective,
    ConfirmModalResetPinComponent,
    CsvDialogComponent,
    OnlyNumberDirective,
    VendorSelectionModalComponent
  ],
  exports: [
    EntityToSlugPipe,
    CamelToHumanizedPipe,
    GetUserDisplayNamePipe,
    PaginationComponent,
    DetailTitleComponent,
    ListHeaderComponent,
    DetailActionsComponent,
    TrueFalseComponent,
    AddressComponent,
    FieldErrorsComponent,
    FieldDatetimeComponent,
    NonFieldErrorsComponent,
    SpinnerComponent,
    ProductSelectionModalComponent,
    StockRecordSelectionModalComponent,
    PaginationChildComponent,
    UserSelectionModalComponent,
    IncludeDeletedComponent,
    SortToggleComponent,
    CustomerGroupModalComponent,
    IncludeInactiveComponent,
    MilestoneComponent,
    ActivityTrackingComponent,
    NusTabsComponent,
    NusTabComponent,
    FieldErrorsMarketplaceComponent,
    ConfirmModalComponent,
    TooltipComponent,
    EmptyListComponent,
    MarketplaceShippingInfoModalComponent,
    ConfirmModalReceivingOrderComponent,
    ConfirmModalPendingOrderComponent,
    MarketplaceChannelInfoModalComponent,
    MarketplaceStockInfoModalComponent,
    OnlyNumberDirective,
    OrderType,
    ConfirmModalResetPinComponent,
    CsvDialogComponent,
    VendorSelectionModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2FlatpickrModule,
    MatCheckboxModule
  ],
})
export class SharedModule {}
