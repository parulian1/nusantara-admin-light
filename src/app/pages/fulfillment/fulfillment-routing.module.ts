import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { OrderListComponent } from './orders';

const routes: Routes = [
  {
    path: 'orders',
    children: [
      {
        component: OrderListComponent,
        path: ''
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FulfillmentRoutingModule { }
