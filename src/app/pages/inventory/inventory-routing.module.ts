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

import { PublishListComponent } from '../config/marketplace-integration';
import {
  AdjustmentComponent,
  AdjustmentDetailComponent,
  AdjustmentDetailResolver
} from '@nusantara/pages/inventory/adjustment';
import { RequirePermissionGuard } from '@nusantara/auth/guards/require-permission.guard';
import {
  InventoryTransferDetailComponent
} from '@nusantara/pages/inventory/transfer-order/inventory-transfer-detail.component';


const routes: Routes = [
  {
    path: 'receiving',
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: InventoryReceivingComponent,
        resolve: {
          warehouses: config.warehouse.AllWarehouseResolver
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: InventoryReceivingDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: InventoryReceivingOrderDetailResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        }
      }
    ]
  },
  {
    path: 'transfer-order',
    canActivateChild: [RequirePermissionGuard],
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
        component: InventoryTransferDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: InventoryTransferOrderDetailResolver,
          warehouses: config.warehouse.AllWarehouseResolver,
        }
      }
    ]
  },
  {
    path: 'orders-list',
    canActivateChild: [RequirePermissionGuard],
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
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: AdjustmentComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          warehouses: config.warehouse.AllWarehouseResolver,
          productClasses: AllProductClassResolver,
        },
      },
      {
        path: ':slug',
        component: AdjustmentDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: AdjustmentDetailResolver,
        }
      }
    ]
  },
  {
    path: 'publish',
    canActivateChild: [RequirePermissionGuard],
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
