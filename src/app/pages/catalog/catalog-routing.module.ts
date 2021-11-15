import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as config from '@nusantara/pages/config';
import { CategoryComponent, CategoryListComponent, AllCategoryResolver } from './category';
import { ProductClassListComponent, ProductClassComponent, AllProductClassResolver } from './product-class';
import { ProductListComponent, ProductComponent, ProductListResolver, ProductResolver, ParentProductResolver  } from './product';
import { VendorComponent, VendorListComponent } from './vendor';
import {
  CategoryResolver,
  CategoryListResolver,
  CategoryParentOptionsResolver,
  ProductAttributeTypeResolver,
  ProductClassResolver,
  ProductClassListResolver,
  ProductClassTypeResolver,
  VendorListResolver,
  VendorResolver,
  ProductOptionResolver,
  ProductOptionTypeResolver,
  ActiveProductOptionResolver, MarketplaceLogisticListResolver,
} from '@nusantara/resolvers';
import { MediaTypeResolver } from './product/media';
import { PriceListTypeResolver } from './product/price';
import { ProductOptionListComponent, AllProductOptionResolver, ProductOptionComponent  } from './product-options';
import { DurationListResolver, LengthListResolver, PacketListResolver } from './product/subscription';
import { RequireIsEnterpriseGuard } from '@nusantara/auth/guards';
import { EditShippingComponent } from '../config/marketplace-integration';
import { AllVendorResolver } from './product/all-vendor.resolver';
import {
  AdvancedPriceComponent,
  AdvancedPriceListComponent,
  AdvancedPriceListResolver
} from '@nusantara/pages/catalog/advanced-price';
import {AdvancedPriceResolver} from "@nusantara/pages/catalog/advanced-price/advanced-price.resolver";

const routes: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        component: CategoryListComponent,
        resolve: { page: CategoryListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: CategoryComponent,
        resolve: { parentOptions: CategoryParentOptionsResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: CategoryComponent,
        resolve: {
          entity: CategoryResolver,
          parentOptions: CategoryParentOptionsResolver
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
        resolve: { page: ProductListResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: ProductComponent,
        resolve: {
          // productClasses: AllProductClassResolver,
          // vendors: AllVendorResolver,
          // categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          subscriptionPacket: PacketListResolver,
          subscriptionDuration: DurationListResolver,
          subscriptionLength: LengthListResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: 'new/:type',
        component: ProductComponent,
        resolve: {
          productClasses: AllProductClassResolver,
          // vendors: AllVendorResolver,
          // categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          subscriptionPacket: PacketListResolver,
          subscriptionDuration: DurationListResolver,
          subscriptionLength: LengthListResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: ProductComponent,
        resolve: {
          entity: ProductResolver,
          // productClasses: AllProductClassResolver,
          // vendors: AllVendorResolver,
          // categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          subscriptionPacket: PacketListResolver,
          subscriptionDuration: DurationListResolver,
          subscriptionLength: LengthListResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':parent-slug/variants/new',
        component: ProductComponent,
        resolve: {
          productClasses: AllProductClassResolver,
          // vendors: AllVendorResolver,
          // categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          parent: ParentProductResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':parent-slug/variants/:slug',
        component: ProductComponent,
        resolve: {
          entity: ProductResolver,
          productClasses: AllProductClassResolver,
          // vendors: AllVendorResolver,
          // categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          parent: ParentProductResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
  {
    path: 'product-classes',
    children: [
      {
        path: '',
        component: ProductClassListComponent,
        resolve: { page: ProductClassListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: ProductClassComponent,
        resolve: {
          typeChoices: ProductClassTypeResolver,
          attributeTypeChoices: ProductAttributeTypeResolver,
          optionChoices: ActiveProductOptionResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail' },
      },
      {
        path: ':slug',
        component: ProductClassComponent,
        resolve: {
          entity: ProductClassResolver,
          typeChoices: ProductClassTypeResolver,
          attributeTypeChoices: ProductAttributeTypeResolver,
          optionChoices: ActiveProductOptionResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'vendors',
    children: [
      {
        path: '',
        component: VendorListComponent,
        resolve: { page: VendorListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: VendorComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: VendorComponent,
        resolve: { entity: VendorResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
  {
    path: 'product-options',
    canActivate: [RequireIsEnterpriseGuard],
    children: [
      {
        path: '',
        component: ProductOptionListComponent,
        resolve: { page: AllProductOptionResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: ProductOptionComponent,
        resolve: {
          typeChoices: ProductOptionTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: ProductOptionComponent,
        resolve: { entity: ProductOptionResolver, typeChoices: ProductOptionTypeResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
  {
    path: 'edit-shipping/:shop-slug',
    component: EditShippingComponent,
    resolve: { logistics: MarketplaceLogisticListResolver },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'advanced-price',
    canActivate: [RequireIsEnterpriseGuard],
    children: [
      {
        path: '',
        component: AdvancedPriceListComponent,
        resolve: { page: AdvancedPriceListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: AdvancedPriceComponent,
        runGuardsAndResolvers: 'always',
        resolve: { warehouses: config.warehouse.AllWarehouseResolver, },
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: AdvancedPriceComponent,
        resolve: {
          entity: AdvancedPriceResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
