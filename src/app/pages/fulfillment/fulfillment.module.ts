import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { FulfillmentRoutingModule } from './fulfillment-routing.module';
import { OrderListComponent, OrderComponent } from './orders';
import { OrderPaymentConfirmComponent, OrderPaymentConfirmDialogComponent } from './orders/containers';
import { NgxSmartModalModule } from 'ngx-smart-modal';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderComponent,
    OrderPaymentConfirmComponent,
    OrderPaymentConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FulfillmentRoutingModule,
    NgxSmartModalModule,
  ]
})
export class FulfillmentModule { }
