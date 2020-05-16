import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { PromotionRoutingModule } from './promotion-routing.module';

import { PromotionListComponent } from './promotion';
import { VoucherListComponent} from './voucher';
import { WidgetListComponent } from './widget';

@NgModule({
  declarations: [
    PromotionListComponent,
    VoucherListComponent,
    WidgetListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PromotionRoutingModule,
  ],
})
export class PromotionModule { }
