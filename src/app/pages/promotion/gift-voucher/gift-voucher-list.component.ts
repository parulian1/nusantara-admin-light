import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGiftVoucher } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-gift-voucher-list',
  template: `
    <nus-list-header i18n-title
      title="Gift Vouchers">
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
          <th class="numeric" i18n>Valid From</th>
          <th class="numeric" i18n>Valid To</th>
          <th i18n>Is Active</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td class="numeric">{{ entity.validFrom|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
          <td class="numeric"><span *ngIf="!!entity.validTo">{{ entity.validTo|date: 'dd/MM/yyyy HH:mm:ss' }}</span></td>
          <td><nus-true-false [value]="entity.isActive"></nus-true-false></td>
        </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>
  `,
})
export class GiftVoucherListComponent extends AbstractListComponent<IGiftVoucher> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
