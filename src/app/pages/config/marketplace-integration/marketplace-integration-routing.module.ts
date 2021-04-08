import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  MarketplaceLogisticListResolver,
  MarketplaceProductClassListResolver,
  MarketplaceShopListResolver,
} from '@nusantara/resolvers';
import { ConnectComponent, ConnectionFormComponent } from './connect';
import {
  SetupComponent,
  EditShippingComponent,
  ProductClassMappingListComponent,
  ProductClassMappingFormComponent,
} from './setup';
import { MarketplaceIntegrationComponent } from './marketplace-integration.component';
import { PublishListComponent, PublishDetailComponent } from './publish';
import {ShopifyMessageListComponent} from '@nusantara/pages/config/shopify/shopify-message-list.component';
import {ShopifyMessageListResolver} from '@nusantara/pages/config/shopify/resolvers/shopify-message-list-resolver.service';
import {ShopifyWebhookComponent} from '@nusantara/pages/config/shopify/shopify-webhook.component';
import {ShopifyWebhookResolver} from '@nusantara/pages/config/shopify/resolvers/shopify-webhook.resolver';
import {ShopifyCarrierResolver} from '@nusantara/pages/config/shopify/resolvers/shopify-carrier.resolver';
import {ShopifyHubComponent} from '@nusantara/pages/config/shopify/shopify-hub.component';

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
  {
    path: 'shopify',
    children: [
      {
        path: '',
        component: ShopifyHubComponent,
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'message',
        component: ShopifyMessageListComponent,
        resolve: {page: ShopifyMessageListResolver},
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'webhook',
        component: ShopifyWebhookComponent,
        resolve: {
          page: ShopifyWebhookResolver,
          carrier: ShopifyCarrierResolver
        },
        runGuardsAndResolvers: 'always'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceIntegrationRoutingModule {}
