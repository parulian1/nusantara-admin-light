import { Component } from '@angular/core';

import { AbstractListComponent } from '@nusantara/core';
import { IVendor } from '@nusantara/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nus-vendor-list',
  template: `
    <nus-list-header i18n-title
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
        <th translate i18n>Name</th>
        <th class="centered" i18n>Has Icon</th>
        <th class="centered" i18n>Has Banner</th>
        <th class="numeric" i18n>Product Count</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td class="centered"><nus-true-false [value]="!!entity.iconImage" [showFalseIcon]="false"></nus-true-false></td>
        <td class="centered"><nus-true-false [value]="!!entity.bannerImage" [showFalseIcon]="false"></nus-true-false></td>
        <td class="numeric">{{ entity.productCount }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `
})
export class VendorListComponent extends AbstractListComponent<IVendor> {
  constructor(route: ActivatedRoute) { super(route); }
}
