import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrderComponent, OrderListComponent, OrderListResolver, OrderResolver } from './orders';
import { OrderTypeResolver, OrderStatusResolver, OrderFilterResolver } from '@nusantara/resolvers';
import { RequirePermissionGuard } from '@nusantara/auth/guards/require-permission.guard';

const routes: Routes = [
  {
    path: 'orders',
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        component: OrderListComponent,
        path: '',
        resolve: {
          page: OrderListResolver,
          orderType: OrderTypeResolver,
          orderStatus: OrderStatusResolver,
          orderFilter: OrderFilterResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        component: OrderComponent,
        path: 'new',
      },
      {
        component: OrderComponent,
        path: ':slug',
        resolve: {
          entity: OrderResolver,
          orderStatus: OrderStatusResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FulfillmentRoutingModule { }
