import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-external-integration',
  template: `
    <h1 class="title-1" i18n>External Integration Configuration</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Connect to KGX WMS</h1>
        <p i18n>Add connection to KGX WMS System
        </p>
      </div>
      <div>
        <button routerLink="kgx-wms" class="control" i18n>Open</button>
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
export class ExternalIntegrationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
