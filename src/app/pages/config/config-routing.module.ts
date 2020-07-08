import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListResolver, WarehouseResolver } from '@nusantara/resolvers';
import { WarehouseListComponent, WarehouseComponent, SubLocationTypeResolver,
  WarehouseTypeResolver, WarehouseFullListResolver } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayListResolver } from './payment-gateways';
import { ConfigHubComponent } from './config-hub.component';
import {
  ShippingMethodListComponent,
  ShippingProviderDetailComponent,
  ShippingProviderListResolver,
  ShippingProviderResolver,
  ShippingProviderTypeResolver,
} from './shipping';



const routes: Routes = [
  { path: '', component: ConfigHubComponent },
  {
    path: 'warehouses',
    children: [
      {
        path: '',
        component: WarehouseListComponent,
        resolve: { page: WarehouseListResolver },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new',
        component: WarehouseComponent,
        resolve: {
          types: WarehouseTypeResolver,
          subLocationTypes: SubLocationTypeResolver,
          allWarehouses: WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WarehouseComponent,
        resolve: {
          entity: WarehouseResolver,
          types: WarehouseTypeResolver,
          subLocationTypes: SubLocationTypeResolver,
          allWarehouses: WarehouseFullListResolver,
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
        component: PaymentGatewayListComponent,
        resolve: { page: PaymentGatewayListResolver },
        runGuardsAndResolvers: 'always',
      }
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
