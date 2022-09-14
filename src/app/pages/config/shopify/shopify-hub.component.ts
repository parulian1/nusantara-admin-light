import { Component } from '@angular/core';

@Component({
  selector: 'nus-shopify-hub',
  template: `
    <nus-page-title i18n-title title="Shopify"></nus-page-title>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Shopify</h1>
        <p i18n>Shopify Order Message</p>
      </div>
      <div>
        <button routerLink="message" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Shopify</h1>
        <p i18n>Webhook Config</p>
      </div>
      <div>
        <button routerLink="webhook" class="control" i18n>Open</button>
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
  ],
})
export class ShopifyHubComponent {}
