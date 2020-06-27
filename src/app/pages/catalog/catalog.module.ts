import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryDetailComponent } from './category';
import { ProductClassListComponent, ProductClassComponent } from './product-class';
import * as product from './product';
import { VendorListComponent, VendorComponent } from './vendor';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailComponent,

    ProductClassListComponent,
    ProductClassComponent,

    product.ProductListComponent,
    product.ProductComponent,
    product.ProductMediaComponent,
    product.ProductMediaListComponent,
    product.PriceListHostComponent,
    product.PriceListComponent,
    product.PriceListRangeComponent,

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
