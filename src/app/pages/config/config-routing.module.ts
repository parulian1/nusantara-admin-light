import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';


const routes: Routes = [
  {
    path: 'marketplace-integration',
    canActivate: [RequireIsEnterpriseGuard, ],
    loadChildren: () =>
      import('./marketplace-integration/marketplace-integration.module').then(
        (m) => m.MarketplaceIntegrationModule
      ),
  },
  {
    path: 'website-settings',
    loadChildren: () =>
      import('./website-settings/website-settings.module').then(
        (m) => m.WebsiteSettingsModule
      ),
  },
  {
    path: 'pos-integration',
    canActivate: [RequireIsEnterpriseGuard, ],
    loadChildren: () =>
      import('./pos-integration/pos-integration.module').then(
        (m) => m.PosIntegrationModule
      ),
  },
  {
    path: 'general-settings',
    loadChildren: () =>
      import('./general-settings/general-settings.module').then(
        (m) => m.GeneralSettingsModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigRoutingModule {}
