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

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.code }}</td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class WarehouseListComponent extends AbstractListComponent<IWarehouse> {
  constructor(protected route: ActivatedRoute) { super(); }
}
