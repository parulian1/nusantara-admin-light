import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListResolver, WarehouseResolver } from '@nusantara/resolvers';
import { WarehouseListComponent, WarehouseDetailComponent, SubLocationTypeResolver, WarehouseTypeResolver } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayListResolver } from './payment-gateways';
import { ConfigHubComponent } from './config-hub.component';
import { ShippingMethodListComponent } from './shipping-methods';
import { WarehouseFullListResolver } from '@nusantara/pages/config/warehouse/warehouse-full-list.resolver';



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
        component: WarehouseDetailComponent,
        resolve: {
          types: WarehouseTypeResolver,
          subLocationTypes: SubLocationTypeResolver,
          allWarehouses: WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WarehouseDetailComponent,
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
        // resolve: { page: ShippingMethodListResolver },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
