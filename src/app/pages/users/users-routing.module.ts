import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CustomerGroupListResolver,
  CustomerGroupResolver,
  CustomerGroupTypeOptionsResolver,
  CustomerResolver
} from '@nusantara/resolvers';

import { CustomerListComponent, CustomerDetailComponent } from './customer';
import { CustomerGroupListComponent, CustomerGroupDetailComponent } from './customer-group';


const dashboardRoutes: Routes = [
  { path: 'users', component: CustomerListComponent },
  { path: 'users/new', component: CustomerDetailComponent },
  { path: 'users/:username', component: CustomerDetailComponent, resolve: { user: CustomerResolver }},

  {
    path: 'customer-groups',
    children: [
      {
        path: '',
        component: CustomerGroupListComponent,
        resolve: { page: CustomerGroupListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: CustomerGroupDetailComponent,
        resolve: { typeChoices: CustomerGroupTypeOptionsResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':slug',
        component: CustomerGroupDetailComponent,
        resolve: {
          entity: CustomerGroupResolver,
          typeChoices: CustomerGroupTypeOptionsResolver
        },
        runGuardsAndResolvers: 'always'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
