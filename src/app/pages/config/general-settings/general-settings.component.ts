import {Component} from '@angular/core';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';

@Component({
  selector: 'nus-general-settings',
  template: `
    <h1 class="title-1" i18n>General</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Corporate Information</h1>
      </div>
      <div>
        <button routerLink="settings" class="control" i18n>Open</button>
      </div>
    </div>
    <div *ngIf="enterpriseGuard.canActivate(null, null)" class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Groups</h1>
      </div>
      <div>
        <button routerLink="groups" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Payment Gateways</h1>
      </div>
      <div>
        <button routerLink="payment-gateways" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Warehouses</h1>
      </div>
      <div>
        <button routerLink="warehouses" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Shipping Methods</h1>
      </div>
      <div>
        <button routerLink="shipping-methods" class="control" i18n>Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1" i18n>Low Stock Config</h1>
      </div>
      <div>
        <button routerLink="low-stock" class="control" i18n>Open</button>
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

export class GeneralSettingsComponent {
  constructor(public enterpriseGuard: RequireIsEnterpriseGuard) {}
}
