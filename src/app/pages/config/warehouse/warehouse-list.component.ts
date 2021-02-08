import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { SiteConfigService } from '@nusantara/services';

@Component({
  selector: 'nus-warehouse-list',
  template: `
    <nus-list-header
      title="Warehouses"
      description="A warehouse is any location where inventory is held;  This can involved retail locations."
      [canAddNew]="enterprise && !page.entities.length < 1"
    >
    </nus-list-header>

    <nus-pagination *ngIf="enterprise" [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Name/Code</th>
        <th>Street</th>
        <th>City</th>
        <th>Type</th>
        <th>Stock Locations</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }} ({{ entity.code}})</a></td>
        <td>{{ entity.address?.street }}</td>
        <td>{{ entity.address?.city }}</td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.subLocations.length }}</td>
        <td>
          <nus-true-false [value]="entity.isActive"></nus-true-false>
        </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class WarehouseListComponent extends AbstractListComponent<IWarehouse> {
  enterprise = true;

  constructor(route: ActivatedRoute, public configService: SiteConfigService) {
    super(route);
    this.isSmeLicense();
  }

  isSmeLicense() {
    this.enterprise = !this.configService.isSmeLicense();
  }
}
