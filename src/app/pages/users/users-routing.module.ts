import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerGroupListResolver } from '@nusantara/resolvers';

import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UserResolverService } from './user-resolver.service';
import { CustomerGroupListComponent } from './customer-group';


const dashboardRoutes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserDetailComponent },
  { path: 'users/:username', component: UserDetailComponent, resolve: { user: UserResolverService }},

  {
    path: 'customer-groups',
    children: [
      {
        path: '',
        component: CustomerGroupListComponent,
        resolve: { page: CustomerGroupListResolver },
        runGuardsAndResolvers: 'always',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
