import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as config from '@nusantara/pages/config';
import { AllProductClassResolver } from '@nusantara/pages/catalog/product-class';
import { InventoryReceivingComponent } from './receiving/inventory-receiving.component';
import { InventoryOrderListComponent } from './pending-order/inventory-order-list.component';
import { InventoryOrderListResolver } from './pending-order/inventory-order-list.resolver';
import { InventoryReceivingDetailComponent } from "./receiving/inventory-receiving-detail.component";
import { InventoryReceivingOrderDetailResolver } from "./receiving/inventory-receiving-order-detail.resolver";
import {InventoryTransferOrderComponent} from "./transfer-order/inventory-transfer-order.component";
import {InventoryTransferOrderDetailResolver} from "./transfer-order/inventory-transfer-order-detail.resolver";

const routes: Routes = [
  {
    path: 'receiving',
    children: [
      {
        path: '',
        component: InventoryReceivingComponent,
        resolve: {
          warehouses: config.warehouse.AllWarehouseResolver,
          productClasses: AllProductClassResolver,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: InventoryReceivingDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: InventoryReceivingOrderDetailResolver
        }
      }
    ]
  },
  {
    path: 'transfer-order',
    children: [
      {
        path: '',
        component: InventoryTransferOrderComponent,
        resolve: {
          warehouses: config.warehouse.AllWarehouseResolver,
          productClasses: AllProductClassResolver,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: InventoryReceivingDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: InventoryTransferOrderDetailResolver
        }
      }
    ]
  },
  {
    path: 'orders-list',
    children: [
      {
        path: '',
        component: InventoryOrderListComponent,
        resolve: { page: InventoryOrderListResolver },
        runGuardsAndResolvers: 'always'
      },

    ],

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
