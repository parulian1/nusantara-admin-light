import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as config from '@nusantara/pages/config';
import { InventoryReceivingComponent } from './inventory-receiving.component';

const routes: Routes = [
  {
    path: 'receiving',
    component: InventoryReceivingComponent,
    resolve: {
      warehouses: config.warehouse.AllWarehouseResolver,
    },
    runGuardsAndResolvers: 'always'
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
