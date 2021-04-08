import { Component } from '@angular/core';
import { RequireIsEnterpriseGuard } from '@nusantara/auth/guards';

@Component({
  selector: 'nus-website-settings',
  template: `
    <h1 class="title-1">Website Settings</h1>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Blog Feed</h1>
      </div>
      <div>
        <button routerLink="blog-feed" class="control">Open</button>
      </div>
    </div>
    <div class="wrapper">
      <div>
        <h1 class="heading-1">Social Auth</h1>
      </div>
      <div>
        <button routerLink="auth-social" class="control">Open</button>
      </div>
    </div>
    <div *ngIf="enterpriseGuard.canActivate(null, null)" class="wrapper">
      <div>
        <h1 class="heading-1">Reseller</h1>
      </div>
      <div>
        <button routerLink="reseller" class="control">Open</button>
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
export class WebsiteSettingsComponent {
  constructor(public enterpriseGuard: RequireIsEnterpriseGuard) {}
}
