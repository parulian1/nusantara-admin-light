import { Component } from '@angular/core';

import { AbstractListComponent } from '@nusantara/core';
import { IVendor } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-vendor-list',
  template: `
    <nus-list-header
      title="Vendors"
      description="Principals or distributors that provides the products sold.">
    </nus-list-header>
    <table>
      <thead>
      <tr>
        <th translate>Name</th>
        <th>Product Count</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.productCount }}</td>
      </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class VendorListComponent extends AbstractListComponent<IVendor> {
  constructor(protected route: ActivatedRoute) { super(); }
}
