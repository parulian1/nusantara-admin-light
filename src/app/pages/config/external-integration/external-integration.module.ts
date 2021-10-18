import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalIntegrationRoutingModule } from './external-integration-routing.module';
import { KgxWmsComponent } from './kgx-wms/kgx-wms.component';
import { ExternalIntegrationComponent } from './external-integration.component';
import {SharedModule} from '@nusantara/shared';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    KgxWmsComponent,
    ExternalIntegrationComponent
  ],
    imports: [
        CommonModule,
        ExternalIntegrationRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ExternalIntegrationModule { }
