import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigHubComponent } from './config-hub.component';
import { ConfigRoutingModule } from './config-routing.module';
import { SharedModule } from '@nusantara/shared';
// import { WarehouseListComponent, WarehouseDetailComponent } from './warehouse';

@NgModule({
  declarations: [
    ConfigHubComponent,
    // WarehouseListComponent,
    // WarehouseDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ConfigRoutingModule,
  ],
})
export class ConfigModule { }
