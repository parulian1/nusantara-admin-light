import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVoucher } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-voucher-list',
  template: `
    <nus-list-header
      title="Voucher">
    </nus-list-header>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translate>Type</th>
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
  styles: [ ]
})
export class VoucherListComponent extends AbstractListComponent<IVoucher> {
  constructor(route: ActivatedRoute) { super(route); }
}
