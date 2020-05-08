import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryDetailComponent, CategoryListComponent, CategoryResolverService } from './category';
import { ProductClassListComponent } from '@nusantara/pages/catalog/product-class/product-class-list.component';
import { ProductClassDetailComponent } from '@nusantara/pages/catalog/product-class/product-class-detail.component';
import { ProductClassResolver } from '@nusantara/pages/catalog/product-class/product-class-resolver';
import { ParentCategoriesResolver } from '@nusantara/pages/catalog/category/parent-categories.resolver';
import { ProductClassChoiceResolver } from '@nusantara/pages/catalog/product-class/product-class-type-resolver';
import { ProductAttributeTypeResolver } from '@nusantara/pages/catalog/product-attribute';
import { ProductClassListResolver } from '@nusantara/pages/catalog/product-class';


const routes: Routes = [

  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/new', component: CategoryDetailComponent, resolve: { parentOptions: ParentCategoriesResolver }},
  {
    path: 'categories/:slug',
    component: CategoryDetailComponent,
    resolve: {
      entity: CategoryResolverService,
      parentOptions: ParentCategoriesResolver
    }
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
        resolve: { typeChoices: ProductClassChoiceResolver }
      },
      {
        path: ':slug',
        component: ProductClassDetailComponent,
        resolve: {
          entity: ProductClassResolver,
          typeChoices: ProductClassChoiceResolver,
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
