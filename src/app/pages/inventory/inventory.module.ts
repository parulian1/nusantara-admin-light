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
import { InventoryOrderListComponent, InventoryFiltersComponent, InventoryDateFilterComponent } from './pending-order';
import {
  InventoryTransferOrderComponent,
  InventoryTransferLineItemComponent
} from './transfer-order';
import {
  AdjustmentComponent,
  AdjustmentDetailComponent,
  AdjustmentLineItemComponent,
} from './adjustment';
import { StockRecordDialogComponent } from './adjustment/stock-record-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    InventoryReceivingDetailComponent,
    InventoryReceivingDetailItemComponent,
    LineItemComponent,

    InventoryOrderListComponent,
    InventoryFiltersComponent,
    InventoryDateFilterComponent,
    InventoryTransferOrderComponent,
    InventoryTransferLineItemComponent,

    AdjustmentComponent,
    AdjustmentLineItemComponent,
    AdjustmentDetailComponent,
    StockRecordDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
})
export class InventoryModule { }
