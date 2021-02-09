import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryComponent } from './category';

import { ProductClassListComponent, ProductClassComponent } from './product-class';
import { ProductClassAttributesComponent } from './product-class/components';

import * as product from './product';
import { VendorListComponent, VendorComponent } from './vendor';
import {ProductOptionListComponent} from './product-options/product-option-list.component';
import {ProductOptionComponent} from './product-options/product-option.component';
import { StockSearchComponent } from './product/stock-search/stock-search.component';
import { StockInputComponent } from './product/stock-input/stock-input.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryComponent,

    ProductClassListComponent,
    ProductClassComponent,
    ProductClassAttributesComponent,

    product.ProductListComponent,
    product.ProductComponent,

    product.media.NewProductImageComponent,
    product.media.NewProductYoutubeComponent,
    product.media.ProductMediaComponent,
    product.media.ProductMediaHostComponent,

    product.price.PriceListHostComponent,
    product.price.PriceListComponent,
    product.price.RangeComponent,

    product.attribute.ProductAttributeHostComponent,
    product.attribute.AttributeValueComponent,

    product.subscription.ProductSubscriptonHostComponent,

    VendorListComponent,
    VendorComponent,

    ProductOptionListComponent,
    ProductOptionComponent,
    StockSearchComponent,
    StockInputComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule { }
