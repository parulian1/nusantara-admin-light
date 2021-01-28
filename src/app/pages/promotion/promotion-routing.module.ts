import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PointsComponent } from './points/points.component';
import { PointsResolver } from './points/points.resolver';
import { ProductPromotionComponent, ProductPromotionListResolver, ProductPromotionResolver, PromotionListComponent } from './promotion';
import { VoucherComponent, VoucherListComponent } from './voucher';
import { VoucherListResolver } from './voucher/voucher-list.resolver';
import { VoucherResolver } from './voucher/voucher.resolver';

const routes: Routes = [
  {
    path: 'promos',
    children: [
      {
        path: '',
        component: PromotionListComponent,
        resolve: { page: ProductPromotionListResolver, },
        runGuardsAndResolvers: 'always',
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
        component: VoucherListComponent,
        resolve: { page: VoucherListResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: VoucherComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: VoucherComponent,
        resolve: { entity: VoucherResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'points',
    children: [
      {
        path: '',
        component: PointsComponent,
        resolve: { entity: PointsResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
