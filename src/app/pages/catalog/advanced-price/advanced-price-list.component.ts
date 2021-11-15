import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IAdvancedPriceList } from '@nusantara/models/products/advanced-price-list';

@Component({
  selector: 'nus-advanced-price-list',
  template: `
    <nus-list-header
      title="Advanced Price List">
    </nus-list-header>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
        <tr>
          <th translate>Price Name</th>
          <th translate>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>Warehouse (
            <span *ngFor="let warehouse of entity.warehouses">
              {{warehouse.name}}
            </span>
          )</td>
        </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>
  `,
})

export class AdvancedPriceListComponent extends AbstractListComponent<IAdvancedPriceList> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
