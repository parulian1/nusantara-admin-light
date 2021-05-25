import { Component } from '@angular/core';

@Component({
  selector: 'nus-marketplace-integration',
  template: `
    <h1 class="title-1">Marketplace Configuration</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Connect to Marketplace</h1>
        <p>Add store, Map Attribute
        </p>
      </div>
      <div>
        <button routerLink="connect" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Marketplace Setup</h1>
        <p>Set Up Shipping, Set Up Showcase</p>
      </div>
      <div>
        <button routerLink="setup" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Publish to Marketplace</h1>
        <p>See Publish Progress, See Publish History</p>
      </div>
      <div>
        <button routerLink="publish" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Shopify</h1>
        <p>Shopify Integration</p>
      </div>
      <div>
        <button routerLink="shopify" class="control">Open</button>
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
