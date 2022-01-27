import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SharedModule } from '@nusantara/shared';
import { ConfigRoutingModule } from './config-routing.module';
import { WarehouseListComponent, WarehouseComponent } from './warehouse';
import { PaymentGatewayListComponent, PaymentGatewayDetailComponent } from './payment-gateways';
import { ShippingMethodListComponent, ShippingProviderDetailComponent, ShippingServiceComponent } from './shipping';
import { DeviceListComponent, DeviceComponent } from './device';
import { GroupComponent, GroupListComponent, UserGroupComponent } from './group';
import { SiteConfigComponent, SocialMediaHostComponent, ConfigChatServiceComponent, ConfigAnalyticToolComponent, CompanyAddressComponent } from './site-config';
import { ResellerComponent } from './reseller';
import { BlogFeedComponent } from './blog-feed';
import { AuthSocialComponent, AuthSocialListComponent } from './auth-social';
import { PaymentGatewayMetaComponent } from './payment-gateways/payment-gateway-meta/payment-gateway-meta.component';
import { PaymentGatewayInstoreComponent } from './payment-gateways/payment-gateway-instore/payment-gateway-instore.component';
import { ShippingServiceHostComponent } from '@nusantara/pages/config/shipping/shipping-service';
import { ConfigCartDiscountComponent } from '@nusantara/pages/config/config-cart-discount';
import { ShopifyComponent } from './shopify/shopify.component';
import { ShopifyMessageListComponent } from './shopify/shopify-message-list.component';
import { ReindexingComponent } from './reindexing/reindexing.component';
import { ShopifyWebhookComponent } from './shopify/shopify-webhook.component';
import { ShopifyHubComponent } from './shopify/shopify-hub.component';
import { DefaultPinConfigComponent } from '@nusantara/pages/config/default-pin-config';
import {
  LowStockConfigComponent,
  LowStockProductListComponent,
  LowStockProductPaginationComponent
} from './low-stock-config';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

@NgModule({
  declarations: [
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
    ShippingServiceHostComponent,
    ConfigChatServiceComponent,
    ConfigAnalyticToolComponent,
    ConfigCartDiscountComponent,
    CompanyAddressComponent,
    ShopifyComponent,
    ShopifyMessageListComponent,
    ReindexingComponent,
    ShopifyWebhookComponent,
    ShopifyHubComponent,
    DefaultPinConfigComponent,
    LowStockConfigComponent,
    LowStockProductListComponent,
    LowStockProductPaginationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ConfigRoutingModule,
    CKEditorModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never', appearance: 'outline' } },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
  ]
})
export class ConfigModule { }
