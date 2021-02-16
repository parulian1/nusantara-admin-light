import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';

@Component({
  selector: 'nus-warehouse-list',
  template: `
    <nus-list-header
      title="Warehouses"
      description="A warehouse is any location where inventory is held;  This can involved retail locations.">
    </nus-list-header>

    <div>
      <nus-include-deleted></nus-include-deleted>
    </div>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Name/Code</th>
          <th>Street</th>
          <th>City</th>
          <th>Type</th>
          <th class="numeric">Stock Locations</th>
          <th class="centered">Is Active</th>
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
  styles: [],
})
export class WarehouseListComponent extends AbstractListComponent<IWarehouse> {
  constructor(route: ActivatedRoute) { super(route); }
}
