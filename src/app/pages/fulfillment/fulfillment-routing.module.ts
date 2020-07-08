import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrderComponent, OrderListComponent } from './orders';

const routes: Routes = [
  {
    path: 'orders',
    children: [
      {
        component: OrderListComponent,
        path: ''
      },
      {
        component: OrderComponent,
        path: 'new'
      },
      {
        component: OrderComponent,
        path: ':slug'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FulfillmentRoutingModule { }
