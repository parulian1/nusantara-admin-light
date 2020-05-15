import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@nusantara/shared';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list.component';
import { UserDetailComponent } from './user-detail.component';

import { CustomerGroupListComponent } from './customer-group';

@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    CustomerGroupListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
  ],
})
export class UsersModule { }
