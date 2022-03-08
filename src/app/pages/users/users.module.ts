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
  FilterPosEmployeeComponent
} from './employee';
import { EmptyDataPipe } from './empty-data.pipe';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerPointModalComponent,

    EmployeeComponent,
    EmployeeListComponent,
    EmployeeWarehouseHostComponent,
    EmployeeAccessGroupHostComponent,
    FilterPosEmployeeComponent,

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
        MatCheckboxModule,
    ],
})
export class UsersModule { }
