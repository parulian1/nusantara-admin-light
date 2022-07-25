import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { SiteConfigService } from '@nusantara/services';

@Component({
  selector: 'nus-warehouse-list',
  template: `
    <nus-list-header i18n-title
      title="Warehouses"
      description="A warehouse is any location where inventory is held;  This can involved retail locations."
      [canAddNew]="canAddNew()"
    >
    </nus-list-header>

    <div>
      <nus-include-deleted></nus-include-deleted>
    </div>

    <nus-pagination *ngIf="enterprise" [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Name/Code</th>
          <th i18n>Street</th>
          <th i18n>City</th>
          <th i18n>Type</th>
          <th class="numeric" i18n>Stock Locations</th>
          <th class="centered" i18n>Is Active</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }} ({{ entity.code}})</a></td>
        <td>{{ entity.address?.street }}</td>
        <td>{{ entity.address?.city }}</td>
        <td>{{ entity.type }}</td>
        <td class="numeric">{{ entity.subLocations.length }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,

})
export class WarehouseListComponent extends AbstractListComponent<IWarehouse> {
  enterprise = true;

  constructor(route: ActivatedRoute, public configService: SiteConfigService) {
    super(route);
    this.isEnterpriseLicense();
  }

  isEnterpriseLicense() {
    this.enterprise = this.configService.isEnterpriseLicense();
  }

  canAddNew() {
    return (!this.enterprise && this.page.entities.length < 1) || this.enterprise;
  }
}
