import { Component } from '@angular/core';

/**
 * A simple page that displays links to all of the configuration options
 * for a client's site.
 *
 * These are displayed here, rather than on the primary left-hand navigation
 * because these options are more infrequently-accessed.
 */
@Component({
  selector: 'nus-config-hub',
  template: `
    <h1 class="heading-1">Config Hub</h1>
    <div>
      <a id="warehouse-config" [routerLink]="['./warehouses']"><i class="material-icons">domain</i> Warehouses</a>
      <a id="pg-config" [routerLink]="['./payment-gateways']"><i class="material-icons">payment</i> Payment Gateways</a>
      <a id="shipping-method-config" [routerLink]="['./shipping-methods']"><i class="material-icons">local_shipping</i> Shipping Methods</a>
      <a id="marketplace-config" [routerLink]="['./marketplace-integration']"><i class="material-icons">local_mall</i>Marketplace Intergrations</a>
      <a id="group-config" [routerLink]="['./groups']"><i class="material-icons">group</i> Groups</a>
      <a id="reseller-config" [routerLink]="['./reseller']"><i class="material-icons">supervised_user_circle</i> Reseller</a>
      <a id="device-config" [routerLink]="['./devices']"><i class="material-icons">point_of_sale</i> Device</a>
      <a id="general-config" [routerLink]="['./settings']"><i class="material-icons">settings</i> General Settings</a>
      <a id="blog-feed-config" [routerLink]="['./blog-feed/settings']"><i class="material-icons">rss_feed</i> Blog Feed Settings</a>
      <a id="blog-feed-config" [routerLink]="['./auth-social']"><i class="material-icons">account_circle</i> Social Auth</a>
    </div>
  `,
  styles: [
    ':host > div { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: 65px; grid-auto-rows: 65px;}',
  ]
})
export class ConfigHubComponent { }
