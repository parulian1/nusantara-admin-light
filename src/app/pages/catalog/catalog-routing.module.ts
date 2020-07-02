import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent, CategoryListComponent } from './category';
import { ProductClassListComponent, ProductClassComponent } from './product-class';
import { ProductListComponent, ProductComponent } from './product';
import { VendorComponent, VendorListComponent } from './vendor';
import {
  CategoryResolver,
  CategoryListResolver,
  CategoryParentOptionsResolver,
  ProductAttributeTypeResolver,
  ProductClassResolver,
  ProductClassListResolver,
  ProductClassTypeResolver,
  ProductListResolver,
  ProductResolver,
  VendorListResolver,
  VendorResolver,
} from '@nusantara/resolvers';
import { MediaTypeResolver } from './product/media';
import { PriceListTypeResolver } from './product/price';
import { AllCategoriesResolver } from '@nusantara/pages/catalog/product/all-categories.resolver';

const routes: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        component: CategoryListComponent,
        resolve: { page: CategoryListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: CategoryComponent,
        resolve: { parentOptions: CategoryParentOptionsResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: CategoryComponent,
        resolve: {
          entity: CategoryResolver,
          parentOptions: CategoryParentOptionsResolver
        },
        runGuardsAndResolvers: 'always',
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
          productClasses: ProductClassListResolver,
          vendors: VendorListResolver,
          categories: AllCategoriesResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: ProductComponent,
        resolve: {
          productClasses: ProductClassListResolver,
          vendors: VendorListResolver,
          categories: AllCategoriesResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: ProductComponent,
        resolve: {
          entity: ProductResolver,
          productClasses: ProductClassListResolver,
          vendors: VendorListResolver,
          categories: AllCategoriesResolver,
          mediaTypes: MediaTypeResolver,
          priceListTypes: PriceListTypeResolver,
        },
        runGuardsAndResolvers: 'always',
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
      },
      {
        path: 'new',
        component: ProductClassComponent,
        resolve: {
          typeChoices: ProductClassTypeResolver,
          attributeTypeChoices: ProductAttributeTypeResolver
        },
        runGuardsAndResolvers: 'always',
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
      },
    ]
  },
  {
    path: 'vendor',
    children: [
      {
        path: '',
        component: VendorListComponent,
        resolve: { page: VendorListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: VendorComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: VendorComponent,
        resolve: { entity: VendorResolver },
        runGuardsAndResolvers: 'always',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
