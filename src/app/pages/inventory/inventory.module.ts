import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import {
  InventoryReceivingComponent,
  InventoryReceivingDetailComponent,
  InventoryReceivingDetailItemComponent,
  LineItemComponent,
} from './receiving';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryOrderListComponent } from './pending-order';
import { InventoryTransferDetailComponent, InventoryTransferOrderComponent } from './transfer-order';
import {
  AdjustmentComponent,
  AdjustmentDetailComponent,
  AdjustmentLineItemComponent,
} from './adjustment';
import { StockRecordDialogComponent } from './adjustment/stock-record-dialog.component';
import {TransferOrderLineItemComponent} from '@nusantara/pages/inventory/transfer-order/transfer-order-line-item.component';
import {
  InventoryTransferLineItemComponent
} from '@nusantara/pages/inventory/transfer-order/inventory-transfer-line-item.component';

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    InventoryReceivingDetailComponent,
    InventoryReceivingDetailItemComponent,
    LineItemComponent,

    InventoryOrderListComponent,
    InventoryTransferOrderComponent,

    AdjustmentComponent,
    AdjustmentLineItemComponent,
    AdjustmentDetailComponent,
    StockRecordDialogComponent,
    TransferOrderLineItemComponent,
    InventoryTransferDetailComponent,
    InventoryTransferLineItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
  ],
})
export class InventoryModule { }
