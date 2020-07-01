import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryDetailComponent } from './category';
import { ProductClassListComponent, ProductClassComponent } from './product-class';
import * as product from './product';
import * as media from './product/media';
import * as price from './product/price';
import { VendorListComponent, VendorComponent } from './vendor';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailComponent,

    ProductClassListComponent,
    ProductClassComponent,

    product.ProductListComponent,
    product.ProductComponent,

    media.NewProductImageComponent,
    media.NewProductYoutubeComponent,
    media.ProductMediaComponent,
    media.ProductMediaHostComponent,

    price.PriceListHostComponent,
    price.PriceListComponent,
    price.PriceListRangeComponent,



    VendorListComponent,
    VendorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule { }
