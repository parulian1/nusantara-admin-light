import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { SharedModule } from '@nusantara/shared';
import { PromotionRoutingModule } from './promotion-routing.module';

import { ProductPromotionComponent, PromotionSingleListComponent, PromotionCampaignListComponent } from './promotion';
import { VoucherListComponent, VoucherComponent } from './voucher';
import { PointsComponent } from './points/points.component';
import { ProductPointsComponent } from './points/product-points/product-points.component';
import { ProductPromoQuantityComponent } from './promotion/product-promo-quantity/product-promo-quantity.component';
import { GiftVoucherComponent, GiftVoucherListComponent } from './gift-voucher';
import {PromotionGroupComponent} from "@nusantara/pages/promotion/promotion/campaign/promotion-group.component";


@NgModule({
  providers: [DatePipe,],
  declarations: [
    ProductPromotionComponent,
    PromotionSingleListComponent,
    VoucherListComponent,
    VoucherComponent,
    PointsComponent,
    ProductPointsComponent,
    ProductPromoQuantityComponent,
    GiftVoucherListComponent,
    GiftVoucherComponent,
    PromotionCampaignListComponent,
    PromotionGroupComponent,
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
