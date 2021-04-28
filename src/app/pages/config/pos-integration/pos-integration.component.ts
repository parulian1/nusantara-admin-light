import {Component} from '@angular/core';

@Component({
  selector: 'nus-pos-integration',
  template: `
    <h1 class="title-1">POS Integration</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">POS Devices</h1>
        <p>Set Up Device Name</p>
      </div>
      <div>
        <button routerLink="devices" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Config Cart Discount</h1>
        <p>Turn on / off Cart Discount</p>
      </div>
      <div>
        <button routerLink="config-cart-discount" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">PIN</h1>
        <p>Set Up Default PIN for POS Account</p>
      </div>
      <div>
        <button routerLink="default-pin-config" class="control">Open</button>
      </div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        padding: 12px 24px;
        margin-bottom: 24px;
        border: solid 1px var(--grey);
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    `,
    'p { line-height: 20px }',
  ]
})

export class PosIntegrationComponent {}
