import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-shopify-hub',
  template: `
    <h1 class="title-1">Shopify</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Shopify</h1>
        <p>Shopify Order Message</p>
      </div>
      <div>
        <button routerLink="message" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Shopify</h1>
        <p>Webhook Config</p>
      </div>
      <div>
        <button routerLink="webhook" class="control">Open</button>
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
export class ShopifyHubComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
