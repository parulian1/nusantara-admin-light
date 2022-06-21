import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoucher } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-voucher-list',
  template: `
    <nus-list-header i18n-title
      title="Vouchers">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
      <nus-include-inactive></nus-include-inactive>
    </div>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th translate i18n>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
        </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>
  `,
})
export class VoucherListComponent extends AbstractListComponent<IVoucher> {
  constructor(route: ActivatedRoute) { super(route); }
}
