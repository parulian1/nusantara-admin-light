import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ExternalIntegrationRoutingModule } from "./external-integration-routing.module";
import { KgxWmsComponent } from "./kgx-wms/kgx-wms.component";
import { ExternalIntegrationComponent } from "./external-integration.component";
import { SharedModule } from "@nusantara/shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WarehouseMappingComponent } from "./warehouse-mapping/warehouse-mapping.component";
import { WarehouseMappingListComponent } from "./warehouse-mapping/warehouse-mapping-list.component";
import {
  PartnerListComponent,
  PartnerComponent,
  WMSFormComponent,
  ForstokFormComponent,
} from "./partner";

@NgModule({
  declarations: [
    KgxWmsComponent,
    ExternalIntegrationComponent,
    WarehouseMappingComponent,
    WarehouseMappingListComponent,
    PartnerComponent,
    PartnerListComponent,
    WMSFormComponent,
    ForstokFormComponent
  ],
  imports: [
    CommonModule,
    ExternalIntegrationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class ExternalIntegrationModule {}
