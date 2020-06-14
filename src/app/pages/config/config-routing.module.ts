import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListResolver, WarehouseResolver, WarehouseTypeChoicesResolver } from '@nusantara/resolvers';
import { WarehouseListComponent, WarehouseDetailComponent } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayListResolver } from './payment-gateways';
import { ConfigHubComponent } from './config-hub.component';



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
          types: WarehouseTypeChoicesResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WarehouseDetailComponent,
        resolve: {
          entity: WarehouseResolver,
          types: WarehouseTypeChoicesResolver,
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
        resolve: {
          entity: PaymentGatewayListResolver
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
