import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UserResolverService } from './user-resolver.service';

const dashboardRoutes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserDetailComponent },
  { path: 'users/:username', component: UserDetailComponent, resolve: { user: UserResolverService }},
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
