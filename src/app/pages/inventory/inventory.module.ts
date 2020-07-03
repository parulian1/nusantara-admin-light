import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryReceivingComponent} from './inventory-receiving.component';
import { ProductSelectionModalComponent} from './product-selection-modal.component';

@NgModule({
  declarations: [
    InventoryReceivingComponent,
    ProductSelectionModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    ReactiveFormsModule,
    InventoryRoutingModule,
  ],
})
export class InventoryModule { }
