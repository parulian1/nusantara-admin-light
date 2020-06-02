import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CustomerGroupListResolver,
  CustomerGroupResolver,
  CustomerGroupTypeOptionsResolver,
  CustomerListResolver,
  CustomerResolver
} from '@nusantara/resolvers';

import { CustomerListComponent, CustomerDetailComponent } from './customer';
import { CustomerGroupListComponent, CustomerGroupDetailComponent } from './customer-group';


const dashboardRoutes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: CustomerListComponent,
        resolve: { page: CustomerListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: CustomerDetailComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':username',
        component: CustomerDetailComponent,
        resolve: { entity: CustomerResolver },
        runGuardsAndResolvers: 'always',
      },
    ]
  },
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
        resolve: {
          typeChoices: CustomerGroupTypeOptionsResolver
        },
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
