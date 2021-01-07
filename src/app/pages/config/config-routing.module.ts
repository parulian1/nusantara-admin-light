import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as wh from './warehouse';
import * as pg from './payment-gateways';
import { ConfigHubComponent } from './config-hub.component';
import {
  ShippingMethodListComponent,
  ShippingProviderDetailComponent,
  ShippingProviderListResolver,
  ShippingProviderResolver,
  ShippingProviderTypeResolver
} from './shipping';
import { DeviceComponent, DeviceListComponent, DeviceListResolver, DeviceResolver } from './device';
import { GroupComponent, GroupListComponent, GroupListResolver, GroupProviderResolver } from './group';
import { ResellerComponent, ResellerProviderTypeResolver } from "./reseller";
import { ResellerProviderResolver } from "./reseller/resolvers/reseller-provider.resolver";
import { SiteConfigComponent, SiteConfigResolver } from "./site-config";
import {BlogFeedComponent} from './blog-feed/blog-feed.component';
import {BlogFeedResolver} from './blog-feed';


const routes: Routes = [
  { path: '', component: ConfigHubComponent },
  {
    path: 'warehouses',
    children: [
      {
        path: '',
        component: wh.WarehouseListComponent,
        resolve: { page: wh.WarehouseListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new',
        component: wh.WarehouseComponent,
        resolve: {
          types: wh.WarehouseTypeResolver,
          subLocationTypes: wh.SubLocationTypeResolver,
          allWarehouses: wh.WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: wh.WarehouseComponent,
        resolve: {
          entity: wh.WarehouseResolver,
          types: wh.WarehouseTypeResolver,
          subLocationTypes: wh.SubLocationTypeResolver,
          allWarehouses: wh.WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      }
    ]
  },
  {
    path: 'payment-gateways',
    children: [
      {
        path: '',
        component: pg.PaymentGatewayListComponent,
        resolve: { page: pg.PaymentGatewayListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: pg.PaymentGatewayDetailComponent,
        resolve: { typeChoices: pg.PaymentGatewayTypeResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: pg.PaymentGatewayDetailComponent,
        resolve: { entity: pg.PaymentGatewayResolver, typeChoices: pg.PaymentGatewayTypeResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'shipping-methods',
    children: [
      {
        path: '',
        component: ShippingMethodListComponent,
        resolve: { page: ShippingProviderListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new',
        component: ShippingProviderDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          types: ShippingProviderTypeResolver,
        }
      },
      {
        path: ':slug',
        component: ShippingProviderDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: ShippingProviderResolver,
          types: ShippingProviderTypeResolver,
        }
      }
    ]
  },
  {
    path: 'blog-feed',
    children: [
      {
        path: '',
        redirectTo: 'settings',
      },
      {
        path: 'settings',
        component: BlogFeedComponent,
        resolve: { entity: BlogFeedResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
  {
    path: 'devices',
    children: [
      {
        path: '',
        component: DeviceListComponent,
        resolve: { page: DeviceListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: DeviceComponent,
        resolve: { entity: DeviceResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'groups',
    children: [
      {
        path: '',
        component: GroupListComponent,
        resolve: { page: GroupListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: GroupComponent,
        resolve: { entity: GroupProviderResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'settings',
    component: SiteConfigComponent,
    resolve: { entity: SiteConfigResolver },
    runGuardsAndResolvers: "always"
  },
  {
    path: 'reseller',
    children: [
      {
        path: '',
        component: ResellerComponent,
        resolve: {
          entity: ResellerProviderResolver,
          types: ResellerProviderTypeResolver,
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
