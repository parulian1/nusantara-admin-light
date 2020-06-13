import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarehouseListResolver, WarehouseResolver } from '@nusantara/resolvers';
import { WarehouseListComponent, WarehouseDetailComponent } from './warehouse';
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
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WarehouseDetailComponent,
        resolve: { entity: WarehouseResolver },
        runGuardsAndResolvers: 'always',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
