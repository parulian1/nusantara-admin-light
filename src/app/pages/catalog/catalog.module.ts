import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryDetailComponent } from './category';
import { ProductClassListComponent, ProductClassDetailComponent } from './product-class';
import { ProductListComponent, ProductDetailComponent, ProductMediaRowComponent } from './product';
import { VendorListComponent, VendorDetailComponent } from './vendor';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailComponent,

    ProductClassListComponent,
    ProductClassDetailComponent,

    ProductListComponent,
    ProductDetailComponent,
    ProductMediaRowComponent,

    VendorListComponent,
    VendorDetailComponent,
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
