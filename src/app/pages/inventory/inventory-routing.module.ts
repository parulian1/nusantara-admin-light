import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as config from '@nusantara/pages/config';
import { AllProductClassResolver } from '@nusantara/pages/catalog/product-class';
import { InventoryReceivingComponent } from './inventory-receiving.component';
import { InventoryOrderListComponent } from './inventory-order-list.component';
import { InventoryOrderListResolver } from './inventory-order-list.resolver';

const routes: Routes = [
  {
    path: 'receiving',
    component: InventoryReceivingComponent,
    resolve: {
      warehouses: config.warehouse.AllWarehouseResolver,
      productClasses: AllProductClassResolver,
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'orders-list',
    component: InventoryOrderListComponent,
    resolve: { page: InventoryOrderListResolver },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'adjustment',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
