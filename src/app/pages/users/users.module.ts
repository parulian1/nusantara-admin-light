import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { UsersRoutingModule } from './users-routing.module';

import { CustomerListComponent, CustomerDetailComponent } from './customer';
import { CustomerGroupListComponent, CustomerGroupDetailComponent } from './customer-group';
import {
  EmployeeComponent, EmployeeListComponent,
  EmployeeWarehouseHostComponent, EmployeeWarehouseListComponent,
} from './employee';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,

    EmployeeComponent,
    EmployeeListComponent,
    EmployeeWarehouseHostComponent,

    CustomerGroupListComponent,
    CustomerGroupDetailComponent,
    EmployeeWarehouseListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
  ],
})
export class UsersModule { }
