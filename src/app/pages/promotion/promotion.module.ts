import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from '@nusantara/shared';
import { PromotionRoutingModule } from './promotion-routing.module';

import { ProductPromotionComponent, PromotionListComponent } from './promotion';
import { VoucherListComponent, VoucherComponent } from './voucher';
import { PointsComponent } from './points/points.component';
import { ProductPointsComponent } from './points/product-points/product-points.component';
import { ProductPromoQuantityComponent } from './promotion/product-promo-quantity/product-promo-quantity.component';
import { GiftVoucherComponent, GiftVoucherListComponent } from './gift-voucher';


@NgModule({
  declarations: [
    ProductPromotionComponent,
    PromotionListComponent,
    VoucherListComponent,
    VoucherComponent,
    PointsComponent,
    ProductPointsComponent,
    ProductPromoQuantityComponent,
    GiftVoucherListComponent,
    GiftVoucherComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    PromotionRoutingModule,
    NgxMaskModule.forRoot(),
    FormsModule
  ],
})
export class PromotionModule { }
