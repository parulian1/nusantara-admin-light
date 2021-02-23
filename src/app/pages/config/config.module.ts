import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '@nusantara/shared';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigHubComponent } from './config-hub.component';
import { WarehouseListComponent, WarehouseComponent } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayDetailComponent } from './payment-gateways';
import { ShippingMethodListComponent, ShippingProviderDetailComponent, ShippingServiceComponent } from './shipping';
import { DeviceListComponent, DeviceComponent } from './device';
import { GroupComponent, GroupListComponent, UserGroupComponent } from './group';
import { SiteConfigComponent, SocialMediaHostComponent } from './site-config';
import { ResellerComponent } from './reseller';
import { BlogFeedComponent } from './blog-feed';
import { AuthSocialComponent } from './auth-social';
import { AuthSocialListComponent } from './auth-social';
import { PaymentGatewayMetaComponent } from './payment-gateways/payment-gateway-meta/payment-gateway-meta.component';
import { PaymentGatewayInstoreComponent } from './payment-gateways/payment-gateway-instore/payment-gateway-instore.component';

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
    DeviceListComponent,
    DeviceComponent,
    GroupListComponent,
    GroupComponent,
    UserGroupComponent,
    ResellerComponent,
    SiteConfigComponent,
    BlogFeedComponent,
    SocialMediaHostComponent,
    AuthSocialComponent,
    AuthSocialListComponent,
    PaymentGatewayMetaComponent,
    PaymentGatewayInstoreComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigRoutingModule,
    CKEditorModule,
    FormsModule,
  ],
})
export class ConfigModule { }
