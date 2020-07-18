import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
} from '@nusantara/resolvers';
import { MediaTypeResolver } from './product/media';
import { PriceListTypeResolver } from './product/price';

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
        resolve: {
          page: ProductListResolver,
          productClasses: AllProductClassResolver,
          vendors: VendorListResolver,
          categories: AllCategoryResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: ProductComponent,
        resolve: {
          productClasses: AllProductClassResolver,
          vendors: VendorListResolver,
          categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: ProductComponent,
        resolve: {
          entity: ProductResolver,
          productClasses: AllProductClassResolver,
          vendors: VendorListResolver,
          categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':parent-slug/variants/new',
        component: ProductComponent,
        resolve: {
          productClasses: AllProductClassResolver,
          vendors: VendorListResolver,
          categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          parent: ParentProductResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':parent-slug/variants/:slug',
        component: ProductComponent,
        resolve: {
          productClasses: AllProductClassResolver,
          vendors: VendorListResolver,
          categories: AllCategoryResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
          parent: ParentProductResolver,
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
          attributeTypeChoices: ProductAttributeTypeResolver
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
          attributeTypeChoices: ProductAttributeTypeResolver
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
