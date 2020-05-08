import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnonWrapperComponent } from './view-wrappers/anon-wrapper.component';
import { MainWrapperComponent } from './view-wrappers/main-wrapper.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AnonWrapperComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: MainWrapperComponent,
    children: [
      {
        path: 'pages',
        loadChildren: () => import('./pages/dashboard').then(m => m.DashboardModule)
      },
      {
        path: 'catalog',
        loadChildren: () => import('./pages/catalog').then(m => m.CatalogModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users').then(m => m.UsersModule)
      },
      {
        path: 'config',
        loadChildren: () => import('./pages/config/config.module').then(m => m.ConfigModule)
      },

      { path: '',   redirectTo: '/pages', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
