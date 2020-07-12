import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlatPageComponent, FlatPageListComponent, FlatPageListResolver, FlatPageResolver } from './flat-page';
import { WidgetComponent, WidgetBlockListComponent, WidgetBlockListResolver, WidgetResolver } from './widget';
import { ContentTypesResolver } from '@nusantara/pages/cms/widget/content-types.resolver';


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
        component: WidgetBlockListComponent,
        resolve: { page: WidgetBlockListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: WidgetComponent,
        resolve: { contentTypes: ContentTypesResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: WidgetComponent,
        resolve: { entity: WidgetResolver, contentTypes: ContentTypesResolver },
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
