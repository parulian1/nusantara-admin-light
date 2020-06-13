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
    <h1>Config Hub</h1>
    <div>
      <a id="warehouse-config" [routerLink]="['./warehouses']"><i class="material-icons">domain</i> Warehouses</a>
      <a id="pg-config">Payment Gateways</a>
      <a id="payment-methods-config">Payment Methods</a>
    </div>
  `,
  styles: [
    ':host > div { display: grid; grid-template-columns: auto auto auto; grid-template-rows: 65px; }',
    '#warehouse-config { grid-column: 1; grid-row: 1 }',
    '#pg-config { grid-column: 2; grid-row: 1 }',
    '#payment-methods-config { grid-column: 3; grid-row: 1 }',
  ]
})
export class ConfigHubComponent { }
