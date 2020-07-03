import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // todo: remove this unless route change ani needed

import { RequireLoggedInGuard } from '@nusantara/auth';
import { MainWrapperComponent, AnonWrapperComponent } from '@nusantara/view-wrappers';


const routes: Routes = [
  {
    path: 'auth',
    component: AnonWrapperComponent,
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./auth').then(m => m.AuthModule),
  },
  {
    path: '',
    component: MainWrapperComponent,
    canActivate: [RequireLoggedInGuard, ],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard').then(m => m.DashboardModule)
      },
      {
        path: 'catalog',
        loadChildren: () => import('./pages/catalog').then(m => m.CatalogModule)
      },
      {
        path: 'cms',
        loadChildren: () => import('./pages/cms').then(m => m.CmsModule)
      },
      {
        path: 'promotion',
        loadChildren: () => import('./pages/promotion').then(m => m.PromotionModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users').then(m => m.UsersModule)
      },
      {
        path: 'fulfillment',
        loadChildren: () => import('./pages/fulfillment').then(m => m.FulfillmentModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./pages/inventory').then(m => m.InventoryModule)
      },
      {
        path: 'config',
        loadChildren: () => import('./pages/config/config.module').then(m => m.ConfigModule)
      },

      { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    BrowserAnimationsModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
