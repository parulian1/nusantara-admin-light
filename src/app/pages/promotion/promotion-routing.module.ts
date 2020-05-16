import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PromotionListComponent } from './promotion';
import { WidgetListComponent } from './widget';
import { VoucherListComponent} from './voucher';

const routes: Routes = [
  {
    path: 'promos',
    children: [
      {
        path: '',
        component: PromotionListComponent,
      },
    ]
  },
  {
    path: 'vouchers',
    children: [
      {
        path: '',
        component: VoucherListComponent
      }
    ]
  },
  {
    path: 'widgets',
    children: [
      {
        path: '',
        component: WidgetListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
