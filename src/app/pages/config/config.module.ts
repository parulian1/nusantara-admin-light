import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@nusantara/shared';

import { ConfigHubComponent } from './config-hub.component';
import { ConfigRoutingModule } from './config-routing.module';

@NgModule({
  declarations: [
    ConfigHubComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ConfigRoutingModule,
  ],
})
export class ConfigModule { }
