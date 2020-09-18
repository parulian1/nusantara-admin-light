import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@nusantara/shared';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigHubComponent } from './config-hub.component';
import { WarehouseListComponent, WarehouseComponent } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayDetailComponent } from './payment-gateways';
import { ShippingMethodListComponent, ShippingProviderDetailComponent, ShippingServiceComponent} from './shipping';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    ConfigHubComponent,
    WarehouseListComponent,
    WarehouseComponent,
    PaymentGatewayListComponent,
    PaymentGatewayDetailComponent,
    ShippingMethodListComponent,
    ShippingProviderDetailComponent,
    ShippingServiceComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        ConfigRoutingModule,
        CKEditorModule,
    ],
})
export class ConfigModule { }
