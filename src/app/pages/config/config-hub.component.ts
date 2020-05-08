import { Component } from '@angular/core';


@Component({
  selector: 'nus-config-hub',
  template: `
    <h1>Config Hub</h1>
    <div>
      <a id="warehouse-config">Warehouses</a>
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
