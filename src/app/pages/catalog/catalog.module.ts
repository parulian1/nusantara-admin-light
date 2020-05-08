import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared/shared.module';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryDetailComponent } from './category';
import { ProductClassListComponent, ProductClassDetailComponent } from './product-class';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryDetailComponent,
    ProductClassListComponent,
    ProductClassDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule { }
