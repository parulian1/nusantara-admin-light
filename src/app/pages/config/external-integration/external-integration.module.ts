import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalIntegrationRoutingModule } from './external-integration-routing.module';
import { KgxWmsComponent } from './kgx-wms/kgx-wms.component';
import { ExternalIntegrationComponent } from './external-integration.component';
import {SharedModule} from '@nusantara/shared';


@NgModule({
  declarations: [
    KgxWmsComponent,
    ExternalIntegrationComponent
  ],
    imports: [
        CommonModule,
        ExternalIntegrationRoutingModule,
        SharedModule
    ]
})
export class ExternalIntegrationModule { }
