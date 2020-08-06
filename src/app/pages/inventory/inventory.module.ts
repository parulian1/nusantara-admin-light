import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import * as receiving from './receiving';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryReceivingComponent} from './inventory-receiving.component';
import { ProductSelectionModalComponent} from './product-selection-modal.component';
import { InventoryOrderListComponent } from './inventory-order-list.component';

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    ProductSelectionModalComponent,
    receiving.LineItemComponent,
    InventoryOrderListComponent,
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
