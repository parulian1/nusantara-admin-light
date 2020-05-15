import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerGroup } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core/components/abstract-list.component';

@Component({
  selector: 'nus-customer-group-list',
  template: `
    <nus-list-header
      title="Customer Groups"
      description="Groups of customers, typically used for promotional targeting">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translate>Customers</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
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
