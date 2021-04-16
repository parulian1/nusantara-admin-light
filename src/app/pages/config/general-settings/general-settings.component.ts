import {Component} from '@angular/core';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';

@Component({
  selector: 'nus-general-settings',
  template: `
    <h1 class="title-1">General</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Corporate Information</h1>
      </div>
      <div>
        <button routerLink="settings" class="control">Open</button>
      </div>
    </div>
    <div *ngIf="enterpriseGuard.canActivate(null, null)" class="wrapper">
      <div>
        <h1 class="heading-1">Groups</h1>
      </div>
      <div>
        <button routerLink="groups" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Payment Gateways</h1>
      </div>
      <div>
        <button routerLink="payment-gateways" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Warehouses</h1>
      </div>
      <div>
        <button routerLink="warehouses" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Shipping Methods</h1>
      </div>
      <div>
        <button routerLink="shipping-methods" class="control">Open</button>
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
