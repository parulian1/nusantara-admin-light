import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SHOPIFY_ROUTES} from './shopify/shopify.routes';
import {ShopifyMessageListComponent} from './shopify/shopify-message-list.component';
import {ShopifyMessageListResolver} from './shopify/resolvers/shopify-message-list-resolver.service';
import {ReindexingComponent} from './reindexing/reindexing.component';
import {ShopifyWebhookComponent} from './shopify/shopify-webhook.component';
import {ShopifyWebhookResolver} from './shopify/resolvers/shopify-webhook.resolver';
import {ShopifyCarrierResolver} from './shopify/resolvers/shopify-carrier.resolver';


const routes: Routes = [
  {
    path: 'marketplace-integration',
    loadChildren: () =>
      import('./marketplace-integration/marketplace-integration.module').then(
        (m) => m.MarketplaceIntegrationModule
      ),
  },
  {
    path: 'website-settings',
    loadChildren: () =>
      import('./website-settings/website-settings.module').then(
        (m) => m.WebsiteSettingsModule
      ),
  },
  {
    path: 'pos-integration',
    loadChildren: () =>
      import('./pos-integration/pos-integration.module').then(
        (m) => m.PosIntegrationModule
      ),
  },
  {
    path: 'website-settings',
    loadChildren: () =>
      import('./website-settings/website-settings.module').then(
        (m) => m.WebsiteSettingsModule
      ),
  },
  {
    path: 'pos-integration',
    loadChildren: () =>
      import('./pos-integration/pos-integration.module').then(
        (m) => m.PosIntegrationModule
      ),
  },
  {
    path: 'general-settings',
    loadChildren: () =>
      import('./general-settings/general-settings.module').then(
        (m) => m.GeneralSettingsModule
      ),
  },
  {
    path: 'shopify',
    children: [
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
export class ConfigRoutingModule {}
