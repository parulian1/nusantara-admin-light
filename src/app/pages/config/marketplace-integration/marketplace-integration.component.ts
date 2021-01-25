import { Component } from '@angular/core';

@Component({
  selector: 'nus-marketplace-integration',
  template: ` 
    <h1 class="heading-1">Marketplace Configuration</h1>
    <div class="wrapper">
      <div>
        <h2>Marketplace Setup</h2>
        <p>Connect to Marketplace, Map Attribute, Set Up Shipping</p>
      </div>
      <div>
        <button routerLink="setup" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h2>Publish to Marketplace</h2>
        <p>See Publish Progress, See Publish History</p>
      </div>
      <div>
        <button routerLink="publish" class="control">Open</button>
      </div>
    </div>`,
  styles: [
    `
      .wrapper {
        padding: 10px 20px;
        border: solid 1px #e7e7e7;
        border-radius: 5px;
        margin-bottom: 20px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
})
export class MarketplaceIntegrationComponent {}
