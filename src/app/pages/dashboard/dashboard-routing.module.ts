import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from '@nusantara/pages/dashboard/dashboard.resolver';

// resolve: { user: UserResolverService }}
const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, resolve: { dashboard: DashboardResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
