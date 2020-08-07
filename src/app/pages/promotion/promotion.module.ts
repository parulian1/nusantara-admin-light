import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { PromotionRoutingModule } from './promotion-routing.module';

import { ProductPromotionComponent, PromotionListComponent } from './promotion';
import { VoucherListComponent} from './voucher';

@NgModule({
  declarations: [
    ProductPromotionComponent,
    PromotionListComponent,
    VoucherListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PromotionRoutingModule,
  ],
})
export class PromotionModule { }
