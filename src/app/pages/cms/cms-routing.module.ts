import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  FlatPageComponent,
  FlatPageListComponent,
  FlatPageListResolver,
  FlatPageResolver,
  AllFlatPageListResolver
} from './flat-page';
import {
  ContentFooterComponent,
  ContentFooterResolver,
  ContentFooterListComponent,
  ContentFooterListResolver,
  RelativeChoicesResolver
} from './content-footer';
import { VendorFullListResolver } from '@nusantara/pages/catalog/vendor';
import { ProductFullListResolver } from '@nusantara/pages/catalog/product';
import {
  WidgetBlockComponent,
  WidgetBlockListComponent,
  WidgetBlockListResolver,
  WidgetBlockResolver,
  BannerGroupComponent
} from './widget';
import { ContentTypesResolver } from './widget/content-types.resolver';
import { BannerComponent, BannerListComponent } from './banner';
import { BannerListResolver, BannerTypeResolver, BannerResolver } from '@nusantara/resolvers';
import {
  TestimonialComponent,
  TestimonialListComponent,
  TestimonialListResolver,
  TestimonialResolver
} from './testimonial';
import { HighlightListResolver, HighlightListComponent, HighlightComponent } from './highlight';
import { HighlightResolver } from './highlight/highlight.resolver';
import { SlaListComponent, SlaListResolver, SlaComponent, SlaResolver } from './sla';
import {NavigationComponent, NavigationListComponent, NavigationResolver} from './navigation';
import {NavigationListResolver} from './navigation/navigation-list/navigation-list-resolver';
import {NavigationRelativeChoicesResolver} from './navigation/navigation-relative-choices-resolver';
import {OnboardingListComponent} from './onboarding';
import {OnboardingComponent, OnboardingContentListResolver, OnboardingContentResolver} from './onboarding';


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
    path: 'navigation',
    children: [
      {
        path: '',
        component: NavigationListComponent,
        resolve: { page: NavigationListResolver },
        runGuardsAndResolvers: 'always',
        data: { animationn: 'List', }
      },
      {
        path: 'new',
        component: NavigationComponent,
        resolve: {
          flatPages: AllFlatPageListResolver,
          relativeChoices: NavigationRelativeChoicesResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: NavigationComponent,
        resolve: {
          entity: NavigationResolver,
          flatPages: AllFlatPageListResolver,
          relativeChoices: NavigationRelativeChoicesResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'content-footers',
    children: [
      {
        path: '',
        component: ContentFooterListComponent,
        resolve: { page: ContentFooterListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', }
      },
      {
        path: 'new',
        component: ContentFooterComponent,
        resolve: {
          flatPages: AllFlatPageListResolver,
          relativeChoices: RelativeChoicesResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: ContentFooterComponent,
        resolve: {
          entity: ContentFooterResolver,
          flatPages: AllFlatPageListResolver,
          relativeChoices: RelativeChoicesResolver,
        },
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
  },

  {
    path: 'banners',
    children: [
      {
        path: '',
        component: BannerListComponent,
        resolve: { page: BannerListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: BannerComponent,
        resolve: {
          typeChoices: BannerTypeResolver
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: BannerComponent,
        resolve: {
          entity: BannerResolver,
          typeChoices: BannerTypeResolver
        },
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'}
      }
    ]
  },
  {
    path: 'highlights',
    children: [
      {
        path: '',
        component: HighlightListComponent,
        resolve: {page: HighlightListResolver},
        runGuardsAndResolvers: 'always',
        data: {animation: 'List'}
      },
      {
        path: 'new',
        component: HighlightComponent,
        resolve: {vendors: VendorFullListResolver},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'}
      },
      {
        path: ':slug',
        component: HighlightComponent,
        resolve: {entity: HighlightResolver, vendors: VendorFullListResolver},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'}
      }
    ]
  },
  {
    path: 'onboardingcontent',
    children: [
      {
        path: '',
        component: OnboardingListComponent,
        resolve: {page: OnboardingContentListResolver},
        runGuardsAndResolvers: 'always',
        data: {animation: 'List'}
      },
      {
        path: 'new',
        component: OnboardingComponent,
        resolve: {},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'}
      },
      {
        path: ':slug',
        component: OnboardingComponent,
        resolve: {entity: OnboardingContentResolver, },
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'}
      }
    ]
  },

  {
    path: 'sla',
    children: [
      {
        path: '',
        component: SlaListComponent,
        resolve: { page: SlaListResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List', },
      },
      {
        path: 'new',
        component: SlaComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: SlaComponent,
        resolve: { entity: SlaResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
