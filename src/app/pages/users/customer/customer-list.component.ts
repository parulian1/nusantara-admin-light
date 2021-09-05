import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ICustomer } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-customer-list',
  template: `
    <nus-list-header i18n-title
      title="Customers"
      description="Users that can make purchases.  This includes employees."
      [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Email</th>
        <th i18n>First Name</th>
        <th i18n>Last Name</th>
        <th class="numeric" i18n>Date Registered</th>
        <th i18n>LTV</th>
        <th class="numeric" i18n>Last Login</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.email }}</a></td>
        <td>{{ entity.firstName }}</td>
        <td>{{ entity.lastName }}</td>
        <td class="numeric">{{ entity.dateJoined|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
        <td>{{ entity.profile?.lifetimeValue|currency:"IDR" }}</td>
        <td class="numeric">{{ entity.lastLogin|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [``]
})
export class CustomerListComponent extends AbstractListComponent<ICustomer> {
  constructor(route: ActivatedRoute) { super(route); }
}
