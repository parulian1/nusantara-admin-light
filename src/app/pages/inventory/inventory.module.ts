import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import * as receiving from './receiving';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryReceivingComponent} from './receiving/inventory-receiving.component';
import { InventoryOrderListComponent } from './pending-order/inventory-order-list.component';
import { InventoryReceivingDetailComponent } from "./receiving/inventory-receiving-detail.component";
import {InventoryTransferOrderComponent} from "./transfer-order/inventory-transfer-order.component";

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    receiving.LineItemComponent,
    InventoryOrderListComponent,
    InventoryReceivingDetailComponent,
    InventoryTransferOrderComponent,
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
