import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { FulfillmentRoutingModule } from './fulfillment-routing.module';
import { OrderListComponent } from './orders/order-list.component';

@NgModule({
  declarations: [
    OrderListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FulfillmentRoutingModule,
  ]
})
export class FulfillmentModule { }
