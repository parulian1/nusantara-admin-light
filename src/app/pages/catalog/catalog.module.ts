import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryComponent } from './category';
import { ProductClassListComponent, ProductClassComponent } from './product-class';
import * as product from './product';
import * as inventory from './inventory';
import { VendorListComponent, VendorComponent } from './vendor';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryComponent,

    ProductClassListComponent,
    ProductClassComponent,

    product.ProductListComponent,
    product.ProductComponent,

    product.media.NewProductImageComponent,
    product.media.NewProductYoutubeComponent,
    product.media.ProductMediaComponent,
    product.media.ProductMediaHostComponent,

    product.price.PriceListHostComponent,
    product.price.PriceListComponent,
    product.price.PriceListRangeComponent,

    product.attribute.ProductAttributeHostComponent,

    VendorListComponent,
    VendorComponent,

    inventory.ReceivingComponent,
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
