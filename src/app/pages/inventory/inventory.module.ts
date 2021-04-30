import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import {
  InventoryReceivingComponent,
  InventoryReceivingDetailComponent,
  LineItemComponent,
} from './receiving';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryOrderListComponent } from './pending-order';
import {InventoryTransferOrderComponent} from './transfer-order';
import {
  AdjustmentComponent,
  AdjustmentDetailComponent,
  AdjustmentLineItemComponent,
} from './adjustment';

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    InventoryReceivingDetailComponent,
    LineItemComponent,

    InventoryOrderListComponent,
    InventoryTransferOrderComponent,

    AdjustmentComponent,
    AdjustmentLineItemComponent,
    AdjustmentDetailComponent,
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
