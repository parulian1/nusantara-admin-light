import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerGroup } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-customer-group-list',
  template: `
    <nus-list-header
      title="Customer Groups"
      description="Groups of customers, typically used for promotional targeting">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th>Type</th>
          <th translate>Customers</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
          <td>{{ entity.userCount }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class CustomerGroupListComponent extends AbstractListComponent<ICustomerGroup> {
  constructor(protected route: ActivatedRoute) { super(); }
}
