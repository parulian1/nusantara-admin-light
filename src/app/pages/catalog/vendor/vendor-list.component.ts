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
     <div class="filtering">
      <!-- Soft deleted product but change the wording into InActive -->
      <nus-include-deleted text="Show Inactive Vendor"></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th translate>Name</th>
        <th class="centered">Has Icon</th>
        <th class="centered">Has Banner</th>
        <th class="numeric">Product Count</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td class="centered"><nus-true-false [value]="!!entity.iconImage" [showFalseIcon]="false"></nus-true-false></td>
        <td class="centered"><nus-true-false [value]="!!entity.bannerImage" [showFalseIcon]="false"></nus-true-false></td>
        <td class="numeric">{{ entity.productCount }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class VendorListComponent extends AbstractListComponent<IVendor> {
  constructor(route: ActivatedRoute) { super(route); }
}
