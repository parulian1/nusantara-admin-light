import { NgModule } from '@angular/core';
import { PosIntegrationComponent } from './pos-integration.component';
import {PosIntegrationRoutingModule} from './pos-integration-routing.module';
import {SharedModule} from "@nusantara/shared";

@NgModule({
  declarations: [
    PosIntegrationComponent
  ],
    imports: [
        PosIntegrationRoutingModule,
        SharedModule
    ]
})
export class PosIntegrationModule {}
