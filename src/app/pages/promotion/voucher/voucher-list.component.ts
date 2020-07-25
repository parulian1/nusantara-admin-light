import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoucher } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-voucher-list',
  template: `
    <nus-list-header
      title="Voucher"
      description="Vouchers are things">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class VoucherListComponent extends AbstractListComponent<IVoucher> {
  constructor(route: ActivatedRoute) { super(route); }
}
