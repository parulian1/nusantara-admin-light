import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { SharedModule } from '@nusantara/shared';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CategoryListComponent, CategoryComponent } from './category';

import { ProductClassListComponent, ProductClassComponent } from './product-class';

import * as product from './product';
import { VendorListComponent, VendorComponent } from './vendor';
import { ProductClassAttributesComponent } from './product-class/components';
import { ProductOptionComponent, ProductOptionListComponent } from './product-options';
import { StockSearchComponent } from './product/stock-search/stock-search.component';
import { StockInputComponent } from './product/stock-input/stock-input.component';

import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BundleLineComponent } from '@nusantara/pages/catalog/product/bundle';
import {
  AdvancedPriceComponent,
  AdvancedPriceListComponent,
  AdvancedPriceProductComponent, AdvancedPriceWarehouseModalComponent
} from '@nusantara/pages/catalog/advanced-price';
import { AdvancePriceComponent } from './product/advance-price/advance-price.component';
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

    product.marketplace.MarketplaceInfoHostComponent,
    product.marketplace.MarketplaceProductEditComponent,

    VendorListComponent,
    VendorComponent,

    ProductOptionListComponent,
    ProductOptionComponent,
    StockSearchComponent,
    StockInputComponent,
    BundleLineComponent,

    AdvancedPriceListComponent,
    AdvancedPriceComponent,
    AdvancedPriceProductComponent,
    AdvancedPriceWarehouseModalComponent,
    AdvancePriceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxSmartModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    CatalogRoutingModule,
    DragDropModule,
    // Angular Material
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
})
export class CatalogModule { }
