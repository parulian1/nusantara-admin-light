import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AbstractListComponent} from '../../../core';
import {IAuthSocial} from '../../../models/auth-social';

@Component({
  selector: 'nus-auth-social-list',
  template: `
    <nus-list-header i18n-title
      title="Social Login"
      description="Social login configuration">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Auth Type</th>
        <th i18n>App Key</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.authType }}</a></td>
        <td>{{ entity.appKey }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [
  ]
})
export class AuthSocialListComponent extends AbstractListComponent<IAuthSocial>{

  constructor(route: ActivatedRoute) {
    super(route);
  }

}
