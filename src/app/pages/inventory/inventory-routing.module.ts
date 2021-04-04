import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as config from '@nusantara/pages/config';
import { AllProductClassResolver } from '@nusantara/pages/catalog/product-class';

import { InventoryReceivingComponent, InventoryReceivingDetailComponent } from './receiving';
import { InventoryReceivingOrderDetailResolver } from './receiving/inventory-receiving-order-detail.resolver';

import { InventoryOrderListComponent } from './pending-order';
import { InventoryOrderListResolver } from './pending-order/inventory-order-list.resolver';

import { InventoryTransferOrderComponent } from './transfer-order';
import { InventoryTransferOrderDetailResolver } from './transfer-order/inventory-transfer-order-detail.resolver';

import {PublishListComponent} from '../config/marketplace-integration';
import { AdjustmentComponent } from '@nusantara/pages/inventory/adjustment';

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
    children: [
      {
        path: '',
        component: AdjustmentComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          warehouses: config.warehouse.AllWarehouseResolver,
          productClasses: AllProductClassResolver,
        },
      }
    ]
  },
  {
    path: 'publish',
    children: [
      {
        path: '',
        component: PublishListComponent,
        runGuardsAndResolvers: 'always',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
