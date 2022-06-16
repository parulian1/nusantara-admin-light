import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerGroup } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-customer-group-list',
  template: `
    <nus-list-header i18n-title
      title="Customer Groups"
      description="Groups of customers, typically used for promotional targeting">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th i18n>Type</th>
          <th translate class="numeric" i18n>Customers</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
          <td class="numeric">{{ entity.userCount }}</td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page" [showLabels]="false"></nus-pagination>
  `,

})
export class CustomerGroupListComponent extends AbstractListComponent<ICustomerGroup> {
  constructor(route: ActivatedRoute) { super(route); }
}
