import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { UsersRoutingModule } from './users-routing.module';

import { CustomerListComponent, CustomerDetailComponent } from './customer';
import { CustomerGroupListComponent, CustomerGroupDetailComponent } from './customer-group';
import {
  EmployeeAccessGroupHostComponent, EmployeeAccessGroupListComponent,
  EmployeeComponent, EmployeeListComponent,
  EmployeeWarehouseHostComponent, EmployeeWarehouseListComponent,
} from './employee';
import { EmptyDataPipe } from './empty-data.pipe';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,

    EmployeeComponent,
    EmployeeListComponent,
    EmployeeWarehouseHostComponent,
    EmployeeAccessGroupHostComponent,

    CustomerGroupListComponent,
    CustomerGroupDetailComponent,
    EmployeeWarehouseListComponent,
    EmployeeAccessGroupListComponent,

    // pipes
    EmptyDataPipe,
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
