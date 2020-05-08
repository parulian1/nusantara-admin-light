import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@nusantara/shared';

import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';
import { UsersRoutingModule } from '@nusantara/pages/users/users-routing.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
  ],
})
export class UsersModule { }
