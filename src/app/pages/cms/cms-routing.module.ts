import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlatPageComponent, FlatPageListComponent, FlatPageListResolver, FlatPageResolver } from './flat-page';
import { WidgetBlockComponent, WidgetBlockListComponent, WidgetBlockListResolver, WidgetBlockResolver, BannerGroupComponent } from './widget';
import { ContentTypesResolver } from './widget/content-types.resolver';
import { TestimonialComponent, TestimonialListComponent, TestimonialListResolver, TestimonialResolver } from './testimonial';
import { VendorFullListResolver } from '@nusantara/pages/catalog/vendor';
import { ProductFullListResolver } from '@nusantara/pages/catalog/product';


const dashboardRoutes: Routes = [
  {
    path: 'flat-pages',
    children: [
      {
        path: '',
        component: FlatPageListComponent,
        resolve: { page: FlatPageListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: FlatPageComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: FlatPageComponent,
        resolve: { entity: FlatPageResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },

  {
    path: 'testimonials',
    children: [
      {
        path: '',
        component: TestimonialListComponent,
        resolve: { page: TestimonialListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: TestimonialComponent,
        resolve: { vendors: VendorFullListResolver, products: ProductFullListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: TestimonialComponent,
        resolve: { entity: TestimonialResolver, vendors: VendorFullListResolver, products: ProductFullListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },

  {
    path: 'widgets',
    children: [
      {
        path: '',
        component: WidgetBlockListComponent,
        resolve: { page: WidgetBlockListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },


      {
        path: 'banners/new',
        component: BannerGroupComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', }
      },
      {
        path: 'banners/:slug',
        component: BannerGroupComponent,
        resolve: { },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', }
      },

      {
        path: 'new',
        component: WidgetBlockComponent,
        resolve: { contentTypes: ContentTypesResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: WidgetBlockComponent,
        resolve: { entity: WidgetBlockResolver, contentTypes: ContentTypesResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
