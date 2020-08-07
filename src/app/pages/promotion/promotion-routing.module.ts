import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductPromotionComponent, ProductPromotionListResolver, ProductPromotionResolver, PromotionListComponent } from './promotion';
import { VoucherListComponent} from './voucher';

const routes: Routes = [
  {
    path: 'promos',
    children: [
      {
        path: '',
        component: PromotionListComponent,
        resolve: { page: ProductPromotionListResolver, },
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: ProductPromotionComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: ProductPromotionComponent,
        resolve: { entity: ProductPromotionResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
