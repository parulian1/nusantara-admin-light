import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalIntegrationRoutingModule } from './external-integration-routing.module';
import { KgxWmsComponent } from './kgx-wms/kgx-wms.component';
import { ExternalIntegrationComponent } from './external-integration.component';
import {SharedModule} from '@nusantara/shared';
import {ReactiveFormsModule} from '@angular/forms';
import { WarehouseMappingComponent } from './warehouse-mapping/warehouse-mapping.component';
import { WarehouseMappingListComponent } from './warehouse-mapping/warehouse-mapping-list.component';


@NgModule({
  declarations: [
    KgxWmsComponent,
    ExternalIntegrationComponent,
    WarehouseMappingComponent,
    WarehouseMappingListComponent
  ],
    imports: [
        CommonModule,
        ExternalIntegrationRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class ExternalIntegrationModule { }
