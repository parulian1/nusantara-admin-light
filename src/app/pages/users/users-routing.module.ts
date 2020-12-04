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
import { EmployeeListComponent, EmployeeComponent, EmployeeListResolver, EmployeeResolver } from './employee';


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
  },
  {
    path: 'employee',
    children: [
      {
        path: '',
        component: EmployeeListComponent,
        resolve: { page: EmployeeListResolver },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'new',
        component: EmployeeComponent,
        runGuardsAndResolvers: 'always',
      },
      {
        path: ':username',
        component: EmployeeComponent,
        resolve: { entity: EmployeeResolver },
        runGuardsAndResolvers: 'always',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
