import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlatPageComponent, FlatPageListComponent, FlatPageListResolver, FlatPageResolver } from './flat-page';


const dashboardRoutes: Routes = [
  {
    path: 'flat-pages',
    children: [
      {
        path: '',
        component: FlatPageListComponent,
        resolve: { page: FlatPageListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: FlatPageComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: FlatPageComponent,
        resolve: { entity: FlatPageResolver },
        runGuardsAndResolvers: 'always',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
