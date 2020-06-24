import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlatPageComponent, FlatPageListComponent, FlatPageListResolver, FlatPageResolver } from './flat-page';
import { WidgetComponent, WidgetListComponent, WidgetListResolver, WidgetResolver } from './widget';


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
  },
  {
    path: 'widgets',
    children: [
      {
        path: '',
        component: WidgetListComponent,
        resolve: { page: WidgetListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: WidgetComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WidgetComponent,
        resolve: { entity: WidgetResolver },
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
