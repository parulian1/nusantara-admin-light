import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrderDetailComponent, OrderListComponent } from './orders';

const routes: Routes = [
  {
    path: 'orders',
    children: [
      {
        component: OrderListComponent,
        path: ''
      },
      {
        component: OrderDetailComponent,
        path: 'new'
      },
      {
        component: OrderDetailComponent,
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
