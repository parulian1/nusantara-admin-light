import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { FulfillmentRoutingModule } from './fulfillment-routing.module';
import { OrderListComponent, OrderComponent } from './orders';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FulfillmentRoutingModule,
  ]
})
export class FulfillmentModule { }
