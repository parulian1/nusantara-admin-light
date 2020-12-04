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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
