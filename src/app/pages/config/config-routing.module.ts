import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequireIsEnterpriseGuard } from '@nusantara/auth';
import { ReindexingComponent } from './reindexing/reindexing.component';
import { RequirePermissionGuard } from '@nusantara/auth/guards/require-permission.guard';

const routes: Routes = [
  {
    path: 'marketplace-integration',
    canActivate: [RequireIsEnterpriseGuard],
    canActivateChild: [RequirePermissionGuard],
    loadChildren: () =>
      import('./marketplace-integration/marketplace-integration.module').then(
        (m) => m.MarketplaceIntegrationModule
      ),
  },
  {
    path: 'external-integration',
    canActivate: [RequireIsEnterpriseGuard,],
    canActivateChild: [RequirePermissionGuard],
    loadChildren: () =>
      import('./external-integration/external-integration.module').then(
        (m) => m.ExternalIntegrationModule
      ),
  },
  {
    path: 'website-settings',
    canActivateChild: [RequirePermissionGuard],
    loadChildren: () =>
      import('./website-settings/website-settings.module').then(
        (m) => m.WebsiteSettingsModule
      ),
  },
  {
    path: 'pos-integration',
    canActivate: [RequireIsEnterpriseGuard,],
    canActivateChild: [RequirePermissionGuard],
    loadChildren: () =>
      import('./pos-integration/pos-integration.module').then(
        (m) => m.PosIntegrationModule
      ),
  },
  {
    path: 'general-settings',
    canActivate: [RequirePermissionGuard],
    canActivateChild: [RequirePermissionGuard],
    loadChildren: () =>
      import('./general-settings/general-settings.module').then(
        (m) => m.GeneralSettingsModule
      ),
  },
  {
    path: 'reindex',
    children: [
      {
        path: '',
        component: ReindexingComponent,
        resolve: {},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail',},
      },
      {
        path: ':slug',
        component: ReindexingComponent,
        resolve: {},
        runGuardsAndResolvers: 'always',
        data: {animation: 'Detail',},
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {
}
