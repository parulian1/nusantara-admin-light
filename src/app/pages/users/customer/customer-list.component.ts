import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICustomer } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-customer-list',
  template: `
    <nus-list-header
      title="Customers"
      description="Users that can make purchases.  This includes employees."
      [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Date Registered</th>
        <th>LTV</th>
        <th>Last Login</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.email }}</a></td>
        <td>{{ entity.firstName }}</td>
        <td>{{ entity.lastName }}</td>
        <td>{{ entity.dateJoined|date }}</td>
        <td>{{ entity.profile?.lifetimeValue|currency:"IDR" }}</td>
        <td>{{ entity.lastLogin|date }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [``]
})
export class CustomerListComponent extends AbstractListComponent<ICustomer> {
  constructor(protected route: ActivatedRoute, protected router: Router) { super(); }
}
