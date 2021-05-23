import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { UsersRoutingModule } from './users-routing.module';

import { CustomerListComponent, CustomerDetailComponent, CustomerPointModalComponent } from './customer';
import { CustomerGroupListComponent, CustomerGroupDetailComponent } from './customer-group';
import {
  EmployeeAccessGroupHostComponent, EmployeeAccessGroupListComponent,
  EmployeeComponent, EmployeeListComponent,
  EmployeeWarehouseHostComponent, EmployeeWarehouseListComponent,
} from './employee';
import { EmptyDataPipe } from './empty-data.pipe';
import {NgxSmartModalModule} from 'ngx-smart-modal';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerPointModalComponent,

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
    NgxSmartModalModule,
  ],
})
export class UsersModule { }
