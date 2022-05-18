import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PointsComponent } from './points/points.component';
import { PointsResolver } from './points/points.resolver';
import {
  ProductPromotionComponent,
  ProductPromotionSingleListResolver,
  ProductPromotionResolver,
  PromotionCampaignListComponent,
  PromotionSingleListComponent, PromotionGroupResolver, PromotionCampaignListResolver
} from './promotion';
import { VoucherComponent, VoucherListComponent } from './voucher';
import { VoucherListResolver } from './voucher/voucher-list.resolver';
import { VoucherResolver } from './voucher/voucher.resolver';
import { GiftVoucherComponent, GiftVoucherListComponent } from './gift-voucher';
import { GiftVoucherListResolver } from './gift-voucher/gift-voucher-list.resolver';
import { GiftVoucherResolver } from './gift-voucher/gift-voucher.resolver';
import { RequireIsEnterpriseGuard } from '@nusantara/auth';
import { RequirePermissionGuard } from '@nusantara/auth/guards/require-permission.guard';
import { PromotionGroupComponent } from '@nusantara/pages/promotion/promotion/campaign/promotion-group.component';

const routes: Routes = [
  {
    path: 'vouchers',
    canActivateChild: [RequirePermissionGuard],
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
    canActivate: [RequireIsEnterpriseGuard,],
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: PointsComponent,
        resolve: { entity: PointsResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' }
      }
    ]
  },
  {
    path: 'gift-voucher',
    canActivate: [RequireIsEnterpriseGuard,],
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: '',
        component: GiftVoucherListComponent,
        resolve: { page: GiftVoucherListResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'List' },
      },
      {
        path: 'new',
        component: GiftVoucherComponent,
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: GiftVoucherComponent,
        resolve: { entity: GiftVoucherResolver, },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
    ]
  },
  {
    path: 'promo',
    canActivateChild: [RequirePermissionGuard],
    children: [
      {
        path: 'single',
        children: [
          {
            path: '',
            component: PromotionSingleListComponent,
            resolve: { page: ProductPromotionSingleListResolver, },
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
        path: 'campaign',
        canActivateChild: [RequirePermissionGuard],
        children: [
          {
            path: '',
            component: PromotionCampaignListComponent,
            resolve: { page: PromotionCampaignListResolver, },
            runGuardsAndResolvers: 'always',
            data: { animation: 'List' },
          },
          {
            path: 'new',
            component: PromotionGroupComponent,
            runGuardsAndResolvers: 'always',
            data: { animation: 'Detail', },
          },
          {
            path: ':slug',
            component: PromotionGroupComponent,
            resolve: { entity: PromotionGroupResolver, },
            runGuardsAndResolvers: 'always',
            data: { animation: 'Detail', },
          },
        ]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
