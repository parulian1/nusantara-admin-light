import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryDetailComponent } from './category';
import { ProductClassListComponent, ProductClassDetailComponent } from './product-class';
import { ProductListComponent, ProductDetailComponent } from './product';
import { VendorListComponent, VendorDetailComponent } from './vendor';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailComponent,

    ProductClassListComponent,
    ProductClassDetailComponent,

    ProductListComponent,
    ProductDetailComponent,

    VendorListComponent,
    VendorDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule { }
