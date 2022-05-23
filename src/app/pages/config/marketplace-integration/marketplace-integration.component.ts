import { Component } from '@angular/core';

@Component({
  selector: 'nus-marketplace-integration',
  template: `
    <h1 class="title-1" i18n>Marketplace Integration</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Connect to Marketplace</h1>
        <p i18n>Add store, Map Attribute
        </p>
      </div>
      <div>
        <button routerLink="connect" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Marketplace Setup</h1>
        <p i18n>Set Up Shipping, Set Up Showcase</p>
      </div>
      <div>
        <button routerLink="setup" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Publish to Marketplace</h1>
        <p i18n>See Publish Progress, See Publish History</p>
      </div>
      <div>
        <button routerLink="publish" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Shopify</h1>
        <p i18n>Shopify Integration</p>
      </div>
      <div>
        <button routerLink="shopify" class="control" i18n>Open</button>
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
export class MarketplaceIntegrationComponent {}
