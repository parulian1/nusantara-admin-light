import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryDetailComponent, CategoryListComponent } from './category';
import { ProductClassListComponent, ProductClassDetailComponent } from './product-class';
import { ProductListComponent, ProductDetailComponent } from './product';
import {
  CategoryResolver,
  CategoryListResolver,
  ParentCategoriesResolver,
  ProductAttributeTypeResolver,
  ProductClassResolver,
  ProductClassListResolver,
  ProductClassTypeResolver,
  ProductListResolver,
  ProductResolver } from '@nusantara/resolvers';

const routes: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        component: CategoryListComponent,
        resolve: { page: CategoryListResolver }
      },
      {
        path: 'new',
        component: CategoryDetailComponent,
        resolve: { parentOptions: ParentCategoriesResolver }
      },
      {
        path: ':slug',
        component: CategoryDetailComponent,
        resolve: {
          entity: CategoryResolver,
          parentOptions: ParentCategoriesResolver
        }
      },
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
        resolve: { page: ProductListResolver },
      },
      {
        path: 'new',
        component: ProductDetailComponent
      },
      {
        path: ':slug',
        component: ProductDetailComponent,
        resolve: { entity: ProductResolver }
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
      },
      {
        path: 'new',
        component: ProductClassDetailComponent,
        resolve: { typeChoices: ProductClassTypeResolver }
      },
      {
        path: ':slug',
        component: ProductClassDetailComponent,
        resolve: {
          entity: ProductClassResolver,
          typeChoices: ProductClassTypeResolver,
          attributeTypeChoices: ProductAttributeTypeResolver,
        },
        runGuardsAndResolvers: 'always',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
