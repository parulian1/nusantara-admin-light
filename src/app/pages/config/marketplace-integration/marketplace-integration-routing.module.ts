import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  MarketplaceLogisticListResolver,
  MarketplaceProductClassListResolver,
  MarketplaceShopListResolver,
  MarketplaceShowcaseResolver,
} from '@nusantara/resolvers';
import { ConnectComponent, ConnectionFormComponent } from './connect';
import {
  SetupComponent,
  EditShippingComponent,
  ProductClassMappingListComponent,
  ProductClassMappingFormComponent,
  ShowcaseComponent,
  ShowcaseListComponent
} from './setup';
import { MarketplaceIntegrationComponent } from './marketplace-integration.component';
import { PublishListComponent, PublishDetailComponent } from './publish';
import { MarketplaceShowcaseListResolver } from '@nusantara/resolvers/marketplace-showcase-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceIntegrationComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'connect',
    children: [
      {
        path: '',
        component: ConnectComponent,
        resolve: { page: MarketplaceShopListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: ConnectionFormComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':shop-slug',
        component: ConnectionFormComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'product-class/:shop-slug',
        children: [
          {
            path: '',
            component: ProductClassMappingListComponent,
            resolve: { page: MarketplaceProductClassListResolver },
            runGuardsAndResolvers: 'always',
          },
          {
            path: ':product-class-slug',
            component: ProductClassMappingFormComponent,
          },
        ],
      },
    ],

  },
  {
    path: 'setup',
    children: [
      {
        path: '',
        component: SetupComponent,
        resolve: { page: MarketplaceShopListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'edit-shipping/:shop-slug',
        component: EditShippingComponent,
        resolve: { logistics: MarketplaceLogisticListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'showcase/:shop-slug',
        children: [
          {
            path: '',
            component: ShowcaseListComponent,
            resolve: { showcases: MarketplaceShowcaseListResolver },
            runGuardsAndResolvers: 'always',
          },
          {
            path: 'new',
            component: ShowcaseComponent,
            runGuardsAndResolvers: 'always',
          },
          {
            path: ':showcase-id',
            component: ShowcaseComponent,
            resolve: { entity: MarketplaceShowcaseResolver },
            runGuardsAndResolvers: 'always',
          },
        ]
      },
    ],
  },
  {
    path: 'publish',
    children: [
      {
        path: '',
        component: PublishListComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':id',
        component: PublishDetailComponent,
        runGuardsAndResolvers: 'always',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceIntegrationRoutingModule {}
