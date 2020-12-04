import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  } from '@nusantara/resolvers';

import {
  ThemeListResolver,
  ThemeResolver,
  ThemeSubscriptionTypeOptionsResolver
} from '@nusantara/resolvers';

import { ThemeListComponent } from './theme-list.component';
import { ThemeDetailComponent } from './theme-detail.component';


const routes: Routes = [
  {
    path: '',
    component: ThemeListComponent,
    resolve: { page: ThemeListResolver },
    runGuardsAndResolvers: 'always'
  },
  {
    path: ':slug',
    component: ThemeDetailComponent,
    resolve: {
      entity: ThemeResolver,
      typeChoices: ThemeSubscriptionTypeOptionsResolver
    },
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
