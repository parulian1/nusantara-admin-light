import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrderComponent, OrderListComponent, OrderListResolver } from './orders';

const routes: Routes = [
  {
    path: 'orders',
    children: [
      {
        component: OrderListComponent,
        path: '',
        resolve: { page: OrderListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        component: OrderComponent,
        path: 'new',
      },
      {
        component: OrderComponent,
        path: ':slug',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FulfillmentRoutingModule { }
