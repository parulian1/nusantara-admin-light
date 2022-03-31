import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GeneralSettingsComponent} from './general-settings.component';
import * as wh from '@nusantara/pages/config/warehouse';
import * as pg from '@nusantara/pages/config/payment-gateways';
import {
  ShippingMethodListComponent,
  ShippingProviderDetailComponent,
  ShippingProviderListResolver,
  ShippingProviderResolver,
  ShippingProviderTypeResolver
} from '@nusantara/pages/config/shipping';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';
import {
  GroupComponent,
  GroupListComponent,
  GroupListResolver,
  GroupProviderResolver
} from '@nusantara/pages/config/group';
import { SiteConfigComponent, SiteConfigResolver, SocialMediaTypeResolver } from '@nusantara/pages/config';
import { GroupUserListResolver } from '@nusantara/pages/config/group/resolvers/group-user-list.resolver';
import { LowStockConfigComponent} from "@nusantara/pages/config/low-stock-config/low-stock-config.component";
import { LowStockConfigResolver} from '@nusantara/pages/config/low-stock-config';

const routes: Routes = [
  {
    path: '',
    component: GeneralSettingsComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'warehouses',
    children: [
      {
        path: '',
        component: wh.WarehouseListComponent,
        resolve: {page: wh.WarehouseListResolver},
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new',
        component: wh.WarehouseComponent,
        resolve: {
          types: wh.WarehouseTypeResolver,
          subLocationTypes: wh.SubLocationTypeResolver,
          allWarehouses: wh.WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: wh.WarehouseComponent,
        resolve: {
          entity: wh.WarehouseResolver,
          types: wh.WarehouseTypeResolver,
          subLocationTypes: wh.SubLocationTypeResolver,
          allWarehouses: wh.WarehouseFullListResolver,
        },
        runGuardsAndResolvers: 'always',
      },
    ],
  },
  {
    path: 'payment-gateways',
    children: [
      {
        path: '',
        component: pg.PaymentGatewayListComponent,
        resolve: {page: pg.PaymentGatewayListResolver},
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: pg.PaymentGatewayDetailComponent,
        resolve: {typeAndExpiryChoices: pg.PaymentGatewayTypeAndExpiryChoiceResolver},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'},
      },
      {
        path: ':slug',
        component: pg.PaymentGatewayDetailComponent,
        resolve: {
          entity: pg.PaymentGatewayResolver,
          typeAndExpiryChoices: pg.PaymentGatewayTypeAndExpiryChoiceResolver
        },
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail'},
      },
    ],
  },
  {
    path: 'shipping-methods',
    children: [
      {
        path: '',
        component: ShippingMethodListComponent,
        resolve: {page: ShippingProviderListResolver},
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: ShippingProviderDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          types: ShippingProviderTypeResolver,
        },
      },
      {
        path: ':slug',
        component: ShippingProviderDetailComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          entity: ShippingProviderResolver,
          types: ShippingProviderTypeResolver,
        }
      }
    ]
  },
  {
    path: 'groups',
    canActivate: [RequireIsEnterpriseGuard],
    children: [
      {
        path: '',
        component: GroupListComponent,
        resolve: {page: GroupListResolver},
        runGuardsAndResolvers: 'always'
      },
      {
        path: ':slug',
        component: GroupComponent,
        resolve: { entity: GroupProviderResolver, userList: GroupUserListResolver },
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail', },
      },
    ]
  },
  {
    path: 'settings',
    component: SiteConfigComponent,
    resolve: {entity: SiteConfigResolver, typeChoices: SocialMediaTypeResolver},
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'low-stock',
    component: LowStockConfigComponent,
    resolve: {
      entity: LowStockConfigResolver,
      subLocationTypes: wh.SubLocationTypeResolver,
      allWarehouses: wh.WarehouseFullListResolver,
    },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSettingsRoutingModule {
}
